// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Address} from "@openzeppelin/contracts/utils/Address.sol";

contract JobEscrow is Ownable, Pausable, ReentrancyGuard {
	using Address for address payable;

	uint256 public constant MAX_PLATFORM_FEE = 10; // 10%

	uint256 public platformFeePercent = 3;
	address public feeRecipient;

	enum JobStatus {
		Created,
		Funded,
		InProgress,
		Completed,
		Disputed,
		Cancelled
	}

	enum MilestoneStatus {
		Pending,
		InProgress,
		Submitted,
		Approved,
		Paid,
		Disputed
	}

	struct Job {
		address client;
		address freelancer;
		uint256 totalAmount;
		uint256 paidAmount;
		uint256 platformFee;
		JobStatus status;
		uint256 createdAt;
	}

	struct Milestone {
		uint256 amount;
		MilestoneStatus status;
		string deliverableHash;
		uint256 submittedAt;
		uint256 approvedAt;
	}

	mapping(bytes32 => Job) public jobs;
	mapping(bytes32 => Milestone[]) private jobMilestones;
	uint256 public totalEscrowBalance;

	event JobCreated(bytes32 indexed jobId, address indexed client, address indexed freelancer, uint256 totalAmount);
	event JobFunded(bytes32 indexed jobId, uint256 amount);
	event MilestoneAdded(bytes32 indexed jobId, uint256 milestoneIndex, uint256 amount);
	event MilestoneSubmitted(bytes32 indexed jobId, uint256 milestoneIndex, string deliverableHash);
	event MilestoneApproved(bytes32 indexed jobId, uint256 milestoneIndex);
	event PaymentReleased(bytes32 indexed jobId, uint256 milestoneIndex, address freelancer, uint256 amount);
	event DisputeRaised(bytes32 indexed jobId, address raisedBy);
	event JobCompleted(bytes32 indexed jobId);
	event JobCancelled(bytes32 indexed jobId, address cancelledBy);

	constructor(address initialFeeRecipient) Ownable(msg.sender) {
		feeRecipient = initialFeeRecipient != address(0) ? initialFeeRecipient : msg.sender;
	}

	function createJob(bytes32 jobId, address freelancer, uint256[] calldata milestoneAmounts)
		external
		payable
		whenNotPaused
		nonReentrant
	{
		require(jobId != bytes32(0), "Invalid jobId");
		Job storage job = jobs[jobId];
		require(job.client == address(0), "Job exists");
		require(freelancer != address(0) && freelancer != _msgSender(), "Invalid freelancer");
		require(milestoneAmounts.length > 0, "Milestones required");

		uint256 totalAmount;
		for (uint256 i = 0; i < milestoneAmounts.length; i++) {
			uint256 amount = milestoneAmounts[i];
			require(amount > 0, "Invalid milestone amount");
			totalAmount += amount;
		}

		require(totalAmount > 0, "Invalid total");

		uint256 platformFee = (totalAmount * platformFeePercent) / 100;
		uint256 requiredValue = totalAmount + platformFee;
		require(msg.value >= requiredValue, "Insufficient funding");

		job.client = _msgSender();
		job.freelancer = freelancer;
		job.totalAmount = totalAmount;
		job.platformFee = platformFee;
		job.status = JobStatus.Funded;
		job.createdAt = block.timestamp;

		totalEscrowBalance += totalAmount;

		Milestone[] storage milestonesForJob = jobMilestones[jobId];
		for (uint256 i = 0; i < milestoneAmounts.length; i++) {
			milestonesForJob.push(
				Milestone({
					amount: milestoneAmounts[i],
					status: MilestoneStatus.Pending,
					deliverableHash: "",
					submittedAt: 0,
					approvedAt: 0
				})
			);
			emit MilestoneAdded(jobId, i, milestoneAmounts[i]);
		}

		emit JobCreated(jobId, job.client, freelancer, totalAmount);
		emit JobFunded(jobId, totalAmount);

		uint256 refund = msg.value - requiredValue;
		if (refund > 0) {
			payable(_msgSender()).sendValue(refund);
		}
	}

	function submitMilestone(bytes32 jobId, uint256 milestoneIndex, string calldata deliverableHash) external {
		Job storage job = _requireJob(jobId);
		require(_msgSender() == job.freelancer, "Not freelancer");
		require(job.status == JobStatus.Funded || job.status == JobStatus.InProgress, "Job inactive");

		Milestone storage milestone = _getMilestone(jobId, milestoneIndex);
		require(
			milestone.status == MilestoneStatus.Pending || milestone.status == MilestoneStatus.InProgress,
			"Cannot submit"
		);

		milestone.status = MilestoneStatus.Submitted;
		milestone.deliverableHash = deliverableHash;
		milestone.submittedAt = block.timestamp;

		if (job.status == JobStatus.Funded) {
			job.status = JobStatus.InProgress;
		}

		emit MilestoneSubmitted(jobId, milestoneIndex, deliverableHash);
	}

	function approveMilestone(bytes32 jobId, uint256 milestoneIndex) external nonReentrant {
		Job storage job = _requireJob(jobId);
		require(_msgSender() == job.client, "Not client");
		require(job.status == JobStatus.InProgress || job.status == JobStatus.Funded, "Job inactivity");

		Milestone storage milestone = _getMilestone(jobId, milestoneIndex);
		require(milestone.status == MilestoneStatus.Submitted, "Not submitted");

		milestone.status = MilestoneStatus.Approved;
		milestone.approvedAt = block.timestamp;

		emit MilestoneApproved(jobId, milestoneIndex);

		milestone.status = MilestoneStatus.Paid;
		uint256 amount = milestone.amount;
		job.paidAmount += amount;
		totalEscrowBalance -= amount;

		payable(job.freelancer).sendValue(amount);
		emit PaymentReleased(jobId, milestoneIndex, job.freelancer, amount);

		if (_allMilestonesPaid(jobId)) {
			job.status = JobStatus.Completed;
			emit JobCompleted(jobId);
			_payoutPlatformFee(jobId);
		}
	}

	function raiseDispute(bytes32 jobId) external {
		Job storage job = _requireJob(jobId);
		require(job.status == JobStatus.Funded || job.status == JobStatus.InProgress, "Cannot dispute");
		require(_msgSender() == job.client || _msgSender() == job.freelancer, "Unauthorized");

		job.status = JobStatus.Disputed;
		emit DisputeRaised(jobId, _msgSender());
	}

	function getMilestones(bytes32 jobId) external view returns (Milestone[] memory) {
		Milestone[] storage stored = jobMilestones[jobId];
		Milestone[] memory result = new Milestone[](stored.length);
		for (uint256 i = 0; i < stored.length; i++) {
			result[i] = stored[i];
		}
		return result;
	}

	function getMilestoneCount(bytes32 jobId) external view returns (uint256) {
		return jobMilestones[jobId].length;
	}

	function setPlatformFee(uint256 newFeePercent) external onlyOwner {
		require(newFeePercent <= MAX_PLATFORM_FEE, "Fee too high");
		platformFeePercent = newFeePercent;
	}

	function setFeeRecipient(address newRecipient) external onlyOwner {
		require(newRecipient != address(0), "Invalid recipient");
		feeRecipient = newRecipient;
	}

	function pause() external onlyOwner {
		_pause();
	}

	function unpause() external onlyOwner {
		_unpause();
	}

	function emergencyWithdraw(bytes32 jobId, address recipient, uint256 amount)
		external
		onlyOwner
		nonReentrant
	{
		require(recipient != address(0), "Invalid recipient");

		Job storage job = _requireJob(jobId);
		uint256 remaining = job.totalAmount - job.paidAmount;
		if (amount > remaining) {
			amount = remaining;
		}

		if (amount > 0) {
			job.totalAmount -= amount;
			totalEscrowBalance -= amount;
		}

		job.status = JobStatus.Cancelled;
		payable(recipient).sendValue(amount + job.platformFee);
		job.platformFee = 0;
		emit JobCancelled(jobId, _msgSender());
	}

	function _requireJob(bytes32 jobId) private view returns (Job storage job) {
		job = jobs[jobId];
		require(job.client != address(0), "Job missing");
	}

	function _getMilestone(bytes32 jobId, uint256 milestoneIndex)
		private
		view
		returns (Milestone storage milestone)
	{
		Milestone[] storage stored = jobMilestones[jobId];
		require(milestoneIndex < stored.length, "Invalid milestone");
		milestone = stored[milestoneIndex];
	}

	function _allMilestonesPaid(bytes32 jobId) private view returns (bool) {
		Milestone[] storage stored = jobMilestones[jobId];
		for (uint256 i = 0; i < stored.length; i++) {
			if (stored[i].status != MilestoneStatus.Paid) {
				return false;
			}
		}
		return stored.length > 0;
	}

	function _payoutPlatformFee(bytes32 jobId) private {
		uint256 feeAmount = jobs[jobId].platformFee;
		if (feeAmount == 0 || feeRecipient == address(0)) {
			return;
		}

		jobs[jobId].platformFee = 0;
		payable(feeRecipient).sendValue(feeAmount);
	}
}
