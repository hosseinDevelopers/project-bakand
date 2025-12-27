import { Controller, Get } from "@nestjs/common";
import { AdminService } from "./admin.service";

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

@Get('dashboard')
async getDashboard() {
  const stats = await this.adminService.getDashboardStats();
  const activities = await this.adminService.getRecentActivities();

  return {
    ...stats,
    recentActivities: activities,
  };
}
  @Get('reservations')
  async getAllReservations() {
    return this.adminService.getAllReservations();
  }
}
