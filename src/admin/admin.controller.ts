import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminService } from './admin.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(JwtAuthGuard)
  @Get('users')
  async getUserList(@Req() req) {
    return this.adminService.getUsers(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('users')
  async patchRole(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.adminService.changeRole(req.user, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('users/:id')
  async deleteUser(@Req() req, @Param('id') id) {
    return this.adminService.deleteUser(req.user, id);
  }
}
