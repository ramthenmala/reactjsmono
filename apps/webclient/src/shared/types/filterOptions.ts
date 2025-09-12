export interface IIsicCode {
	id: string;
	code: number;
}

export interface IRegion {
	id: string;
	name: string;
}

export interface ISector {
	id: string;
	name: string;
}

export interface IAreaRange {
	min: number;
	max: number;
}

export interface ICity {
	id: string;
	name: string;
}

export interface IFilterOptionsData {
	isicCodes?: IIsicCode[];
	regions?: IRegion[];
	sectors?: ISector[];
	areaRange?: IAreaRange;
	cities?: ICity[];
}

export interface IFilteroptionsResponse {
	data: IFilterOptionsData;
}
