
import {
  Body,
  Controller,
  Get,
  Query,

} from '@nestjs/common';
import {  ApiOperation, ApiTags } from '@nestjs/swagger';
import { SearchService } from './search.service';

import { SearchProfessionalDto } from '../dto/searchProfessional.dto';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('professionals')
  @ApiOperation({ summary: 'search for professional' })
  // @ApiTags('professional')
  async searchProfessional(@Query() searchProfessionalDto: SearchProfessionalDto) {
    return this.searchService.searchProfessionals(searchProfessionalDto);
  }


  

}


