import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const skills = [
	{
		name: 'Solidity',
		slug: 'solidity',
		category: 'Smart Contracts',
		description: 'Authoring and maintaining Ethereum Virtual Machine smart contracts.',
	},
	{
		name: 'React',
		slug: 'react',
		category: 'Frontend Engineering',
		description: 'Building component-driven interfaces with React 18 and concurrent features.',
	},
	{
		name: 'Next.js',
		slug: 'nextjs',
		category: 'Frontend Engineering',
		description: 'Delivering hybrid-rendered web apps with App Router, edge streaming, and server actions.',
	},
	{
		name: 'Zero-Knowledge Proofs',
		slug: 'zero-knowledge-proofs',
		category: 'Applied Cryptography',
		description: 'Designing zk circuits and integrating proof systems such as Groth16 and PLONK.',
	},
	{
		name: 'Rust',
		slug: 'rust',
		category: 'Systems Engineering',
		description: 'Writing memory-safe services, smart contracts, and off-chain workers in Rust.',
	},
	{
		name: 'TypeScript',
		slug: 'typescript',
		category: 'Programming Languages',
		description: 'Statically typed application development with modern TypeScript patterns.',
	},
	{
		name: 'Smart Contract Auditing',
		slug: 'smart-contract-auditing',
		category: 'Security',
		description: 'Formal reviews, invariant testing, and exploit prevention for on-chain systems.',
	},
	{
		name: 'Chainlink Automation',
		slug: 'chainlink-automation',
		category: 'Oracles & Automation',
		description: 'Designing autonomous execution pipelines with Chainlink Keepers and Functions.',
	},
	{
		name: 'GraphQL',
		slug: 'graphql',
		category: 'APIs',
		description: 'Modeling strongly-typed API schemas and performant resolvers with caching strategies.',
	},
	{
		name: 'PostgreSQL Performance Tuning',
		slug: 'postgres-performance',
		category: 'Data Infrastructure',
		description: 'Indexing, query planning, and replication strategies for large-scale Postgres.',
	},
	{
		name: 'Kubernetes DevOps',
		slug: 'kubernetes-devops',
		category: 'DevOps',
		description: 'Operating resilient clusters with GitOps, autoscaling, and secure supply chains.',
	},
	{
		name: 'Prompt Engineering',
		slug: 'prompt-engineering',
		category: 'AI Productivity',
		description: 'Designing reliable LLM instructions, guardrails, and evaluation loops.',
	},
	{
		name: 'LangChain',
		slug: 'langchain',
		category: 'AI Frameworks',
		description: 'Building agentic workflows, retrievers, and tool-using pipelines with LangChain.',
	},
	{
		name: 'TensorFlow',
		slug: 'tensorflow',
		category: 'Machine Learning',
		description: 'Training, optimizing, and serving deep learning models with TensorFlow and Keras.',
	},
	{
		name: 'Hardhat Tooling',
		slug: 'hardhat',
		category: 'Smart Contracts',
		description: 'Testing, forking, and deploying Solidity projects with Hardhat plugins.',
	},
	{
		name: 'Ethers.js',
		slug: 'ethersjs',
		category: 'Web3 Engineering',
		description: 'Interacting with EVM networks and account abstraction flows using Ethers.js.',
	},
	{
		name: 'Web3 Product UX',
		slug: 'web3-product-ux',
		category: 'Product Design',
		description: 'Design systems and research for wallet-native, multi-chain user experiences.',
	},
	{
		name: 'DAO Governance Strategy',
		slug: 'dao-governance',
		category: 'Decentralized Operations',
		description: 'Token-voting frameworks, incentive design, and treasury management for DAOs.',
	},
	{
		name: 'On-chain Dispute Operations',
		slug: 'dispute-operations',
		category: 'Trust & Safety',
		description: 'Workflow design for arbitration, juror selection, and evidence evaluation.',
	},
	{
		name: 'Escrow Contract Architecture',
		slug: 'escrow-contracts',
		category: 'Smart Contracts',
		description: 'Milestone-based escrow logic, payout routing, and risk mitigations.',
	},
];

async function main() {
	console.log('🌱 Seeding skills directory...');

	for (const skill of skills) {
		await prisma.skill.upsert({
			where: { slug: skill.slug },
			update: {
				name: skill.name,
				category: skill.category,
				description: skill.description,
				isActive: true,
			},
			create: {
				name: skill.name,
				slug: skill.slug,
				category: skill.category,
				description: skill.description,
			},
		});
	}

	console.log(`✅ Seeded ${skills.length} skills.`);
}

main()
	.catch((error) => {
		console.error('❌ Seed failed', error);
		process.exitCode = 1;
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
