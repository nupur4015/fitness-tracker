import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { ROLES_KEY } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/roles.enum';
import { AuthGuard } from './auth.gaurd';
import { RolesGuard } from 'src/common/gaurds/roles.gaurd';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

export function Auth(...roles: Role[]) {
    return applyDecorators(
      SetMetadata(ROLES_KEY, roles),        
      UseGuards(AuthGuard, RolesGuard),  
      ApiBearerAuth(),                     
      ApiUnauthorizedResponse({ description: 'Unauthorized' }), 
    );
  }
  