import { Injectable } from "@nestjs/common";
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
export class CartridgesService{
    private result : Result;
    getCartridges(data : input){
        let totalAnalytes = data.ligands * data.analytes;
        let analytesPerCartridge = data.rows * data.cols;
        let totalCartridges = Math.ceil(totalAnalytes / analytesPerCartridge);
        let colsPerLigand = Math.ceil(data.analytes/data.rows);
        let totalCols = totalCartridges * data.cols;
        let remainingCols = totalCols - data.ligands * colsPerLigand;
        console.log("Total Analytes = ", totalAnalytes);
        console.log("Analtes Per Cartridge = ", analytesPerCartridge);
        console.log("Total Cartridges = ", totalCartridges);
        console.log("Cols Per Ligand = ", colsPerLigand);
        console.log("Total Cols = ", totalCols);
        console.log("Remining Cols = ", remainingCols);
        this.result = {
            cartridges : totalCartridges,
            ligands : []
        };
      
        for(let i=0; i<data.ligands; i++)
            this.result.ligands.push({name : `L${i+1}`, cols : colsPerLigand, start : 0, end : 0});
        let index = 0;
        while(remainingCols > 0)
        {
            this.result.ligands[index].cols++;
            remainingCols--;
            index++;

            if(index >= data.ligands)
                index = 0;
            console.log(this.result);
        }

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

        return this.result;
    }

    
}