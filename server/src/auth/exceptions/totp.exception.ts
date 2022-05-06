import { ForbiddenException } from "@nestjs/common";

export class TotpException extends ForbiddenException {
	constructor() {
		super('Time-based One-Time Password not provided');
	}
}
