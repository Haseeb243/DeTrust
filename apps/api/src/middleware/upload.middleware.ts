import multer from 'multer';
import type { RequestHandler } from 'express';

import { config } from '../config';
import { ValidationError } from './error.middleware';

const memoryStorage = multer.memoryStorage();
const AVATAR_LIMIT_BYTES = Math.min(config.upload.maxFileSize, 4 * 1024 * 1024);
const DOCUMENT_LIMIT_BYTES = config.upload.maxFileSize;

const createUploadHandler = (field: string, limit: number, filter: multer.Options['fileFilter']): RequestHandler => {
	const uploader = multer({
		storage: memoryStorage,
		fileFilter: filter,
		limits: {
			fileSize: limit,
		},
	});

	return (req, res, next) => {
		uploader.single(field)(req, res, (error) => {
			if (error) {
				if (error instanceof multer.MulterError) {
					const message =
						error.code === 'LIMIT_FILE_SIZE'
							? 'File exceeds the allowed size'
							: 'Upload failed, please try again';
					next(new ValidationError(message));
					return;
				}
				next(error);
				return;
			}
			next();
		});
	};
};

const avatarFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
	if (!file.mimetype.startsWith('image/')) {
		cb(new ValidationError('Only image uploads are allowed'));
		return;
	}
	cb(null, true);
};

const documentFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
	const allowed = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'];
	if (!allowed.some((type) => file.mimetype === type)) {
		cb(new ValidationError('Only PDF or image documents are allowed'));
		return;
	}
	cb(null, true);
};

export const avatarUpload: RequestHandler = createUploadHandler('avatar', AVATAR_LIMIT_BYTES, avatarFilter);
export const documentUpload: RequestHandler = createUploadHandler('document', DOCUMENT_LIMIT_BYTES, documentFilter);

export default avatarUpload;
