import { SetMetadata } from "@nestjs/common";

export const ALLOW_PENDING_KEY = "allow_pending";
export const AllowPending = () => SetMetadata(ALLOW_PENDING_KEY, true);
