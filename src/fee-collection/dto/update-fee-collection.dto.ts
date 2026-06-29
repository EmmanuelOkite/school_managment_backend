import { PartialType } from '@nestjs/swagger';
import { CreateFeeCollectionDto } from './create-fee-collection.dto';
export class UpdateFeeCollectionDto extends PartialType(CreateFeeCollectionDto) {}