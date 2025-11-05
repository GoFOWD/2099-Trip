import bcrypt from 'bcryptjs';

export async function hashPassword(password) {
	const hashedPassword = await bcrypt.hash(password, 10);
	return hashedPassword;
}

export async function validatePassword(password, hashed) {
	const isValidate = await bcrypt.compare(password, hashed);
	return isValidate;
}

export { hashPassword, validatePassword };
