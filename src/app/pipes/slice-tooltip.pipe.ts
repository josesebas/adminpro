import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'sliceTooltip'
})
export class SliceTooltipPipe implements PipeTransform {

	transform(value, tope = 12): any {

		if(value){
			if(value.length > tope){
				return value.slice(0, tope)+'...';
			}
	
			return value;
		}

		return '';
		
	}

}
