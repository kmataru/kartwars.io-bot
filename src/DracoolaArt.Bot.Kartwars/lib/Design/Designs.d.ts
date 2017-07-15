declare namespace DracoolaArt.KartwarsBot.Design {
	export interface IDesignDetails {
		widthCenter: number,
		heightCenter: number
	}

	export interface IDesign {
	}

	export interface IDesignCircle extends IDesign {
		DesignDetails: IDesignDetails;

		getDesign(weaponType: CarWeapon): number[][];
	}

	export interface IDesignPolygon extends IDesign {
		getDesign(weaponType: CarWeapon): Victor[];
	}
}
