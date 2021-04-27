import { Cartridge } from "./cartridge.model";
import { Ligand } from "./ligand.model";

export class Result{
    totalCartridges : number;
    uniqueInteractions : number;
    maxInteractions : number;
    cartridges : Cartridge[];
    ligands : Ligand[];
    mode : string;
}