import { BadRequestException, Body, Controller, Get, Param, Post, Req } from "@nestjs/common";
import { CartridgesService } from "./cartridges.service";
import { input } from "./models/input.model";

@Controller('cartridges')
export class CartridgeController{
    constructor(private readonly service : CartridgesService){}
/*
    ligands : number;
    analytes : number;
    rows : number;
    cols : number;
*/
    @Get()  
    getProducts1(@Req() data1)
    {
        let errorMsgs: Array<string> = [];
        let props = ["ligands", "analytes", "rows", "cols"];
        for(let i = 0; i < props.length; i++)
            if(data1.query[props[i]] == undefined)
                errorMsgs.push(`${props[i]} property is missing`);
        if(errorMsgs.length > 0)
            throw new BadRequestException(errorMsgs);
        console.log("data1  = ", data1.query);
        // validate input params

        let data = {
            ligands : data1.query["ligands"],
            analytes : data1.query["analytes"],
            rows : data1.query["rows"],
            cols : data1.query["cols"]
        };
        console.log("data1  = ", data);
        return this.service.getCartridges(data1.query);
    }

    @Post()  
    getProducts(
        @Body() data : input
    ){
        console.log("Input  = ", data);
        return this.service.getCartridges(data);
    }

    @Get('help')
    getHelp(){
        return this.service.getHelp();
    }
}