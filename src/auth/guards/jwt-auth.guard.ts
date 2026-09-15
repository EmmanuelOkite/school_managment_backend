import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Apply with @UseGuards(JwtAuthGuard) on any route that should require a
// valid Bearer token. Not applied anywhere yet - existing controllers stay
// open until routes are deliberately locked down.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
