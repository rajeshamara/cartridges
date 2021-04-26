import { Module } from "@nestjs/common";
import { CartridgeController } from "./cartridges.controller";
import { CartridgesService } from "./cartridges.service";

@Module({
    controllers: [CartridgeController],
    providers: [CartridgesService],
})
export class CartridgesModule{}