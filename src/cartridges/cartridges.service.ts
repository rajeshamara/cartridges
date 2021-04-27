import { BadRequestException, Injectable } from "@nestjs/common";
import { input } from "./models/input.model";
import { Ligand } from "./models/ligand.model";
import { Result } from "./models/result.model";
/*
result = {
                cartridges : 2,
                ligands : [
                    {name : "L1", cols : 6, start : 0, end : 5},
                    {name : "L2", cols : 5, start : 6, end : 10},
                    {name : "L3", cols : 5, start : 11, end : 15},
                ]
            };
*/

@Injectable()
export class CartridgesService
{
    private result : Result;
    validateInput(data : input)
    {
        let errorMsgs: Array<string> = [];

        // find number of cartridges with 0 count
        let numCartridges = 0;
        data.cartridges.forEach(element => {
            if(Number(element.count) == 0)
                numCartridges++;
        });
        if((numCartridges > 1) || (data.cartridges.length > 1 && numCartridges >= 1))
            errorMsgs.push("More than 1 cartridge with 0 count cannot be specified");

        if(errorMsgs.length > 0)
            throw new BadRequestException(errorMsgs);
    }

    getCartridgesOutput(data : input)
    {

    }
    getAnalytesOutput(data : input)
    {
        let ligandIndex = 0;
        for(let cart = 0; cart < data.cartridges.length; cart++)
        {
            let count = data.cartridges[cart].count;
            let cols = data.cartridges[cart].cols;
            let rows = data.cartridges[cart].rows;
            for(let index = 0; index < count; index++)
            {
                for(let col = 0; col < cols; col++)
                {
                    this.result.ligands[ligandIndex].analytes = Number(this.result.ligands[ligandIndex].analytes) + Number(rows);
                    ligandIndex++;
                    if(ligandIndex >= data.ligands)
                        ligandIndex = 0;    
                    //console.log(this.result.ligands);                    
                }
            }
        }
        ligandIndex = 0;
        let ligandAnalytes = this.result.ligands[ligandIndex].analytes;
        // Now adjust the cols;
        //console.log(`data.cartridges.length = ${data.cartridges.length}`);
        for(let cart = 0; cart < data.cartridges.length; cart++)
        {
            let count = data.cartridges[cart].count;
            let rows = data.cartridges[cart].rows;
            let cols = data.cartridges[cart].cols;
            for(let index = 0; index < count; index++)
            {
                for(let col = 0; col < cols; col++)
                {
                    ligandAnalytes = ligandAnalytes - rows;
                    this.result.ligands[ligandIndex].cols++;
                    //console.log(`(cart, count, index, cols, cols, ligandIndex, ligandAnalytes) = (${cart}, ${count}, ${index}, ${cols}, ${col}, ${ligandIndex}, ${ligandAnalytes})`);
                    //console.log(this.result.ligands); 
                    if(ligandAnalytes <= 0)
                    {
                        ligandIndex++;
                        if(ligandIndex < data.ligands)
                            ligandAnalytes = this.result.ligands[ligandIndex].analytes;
                    }
                }
            }
        }

        //console.log("this.result = ", this.result);
    }

    getCartridges(data : input)
    {
        data.cartridges = data.cartridges.sort((a, b) => Number(a.rows) > Number(b.rows) ? -1 : Number(a.rows) < Number(b.rows) ? 1 : 0);

        this.validateInput(data);
        let maxInteractions: number = 0;
        let totalCartridges: number = 0;
        let totalColumns : number = 0;
        let uniqueInteractions : number = 0;
        data.cartridges.forEach(el => {
            let totalInteractions = Number(el.count) * Number(el.rows) * Number(el.cols);
            maxInteractions = maxInteractions + totalInteractions;
            uniqueInteractions = maxInteractions;
            totalColumns = totalColumns + Number(el.count) * Number(el.cols);
            totalCartridges += Number(el.count);
        });

        this.result = {
            cartridges : data.cartridges,
            uniqueInteractions : uniqueInteractions,
            maxInteractions : maxInteractions,
            totalCartridges : totalCartridges,
            ligands : [],
            mode : ""
        };
        for(let i=0; i<data.ligands; i++)
            this.result.ligands.push({name : `L${i+1}`, cols : 0, start : 0, end : 0, analytes : 0});

        let colsPerLigand : number = 0;
        let totalLigandCols : number = 0;
        let mode : string = "cartridge";
        if(totalCartridges == 0)
        {
            let cartridgeRows = data.cartridges[0].rows;
            let cartridgeCols = data.cartridges[0].cols;
            uniqueInteractions = data.ligands * data.analytes;
            let analytesPerCartridge = cartridgeRows * cartridgeCols;
            totalCartridges = Math.ceil(uniqueInteractions / analytesPerCartridge);
            data.cartridges[0].count = totalCartridges;
            colsPerLigand = Math.ceil(data.analytes/cartridgeRows);
            totalColumns = totalCartridges * cartridgeCols;
            maxInteractions = totalCartridges * cartridgeRows * cartridgeCols;
            this.result.ligands.forEach(elem => {
                elem.analytes = data.analytes; 
                elem.cols = colsPerLigand;
            });
    
    
            //let colsPerLigand = Math.ceil(data.analytes/cartridgeRows);
            //let totalCols = totalCartridges * cartridgeCols;
            let remainingCols = totalColumns - data.ligands * colsPerLigand;
    
    
            let index = 0;
            while(remainingCols > 0)
            {
                this.result.ligands[index].cols++;
                remainingCols--;
                index++;
    
                if(index >= data.ligands)
                    index = 0;
                //console.log(this.result);
            }
        
            
    
        }
        else
        {
            this.getAnalytesOutput(data);
            mode = "analytes";
        }
        this.result.uniqueInteractions = uniqueInteractions;
        this.result.maxInteractions = maxInteractions;
        this.result.totalCartridges = totalCartridges;
        this.result.mode = mode;

        let startCol = -1;
        let endCol = -1;
        for(let i=0; i<this.result.ligands.length; i++)
        {
            endCol++;
            let cols = this.result.ligands[i].cols;
            this.result.ligands[i].start = endCol;
            endCol = endCol + cols - 1;
            this.result.ligands[i].end = endCol;
        }
        //console.log(this.result);
        return this.result;
    }
}