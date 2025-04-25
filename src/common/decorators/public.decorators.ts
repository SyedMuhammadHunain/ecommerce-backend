import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

/*
i. MetaData = data about data
ii. SetMetaData = data to be attached to a route handler
iii. SetMetadata(IS_PUBLIC_KEY, true) = set the MetaData set true, means available for all
*/
