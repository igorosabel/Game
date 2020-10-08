import { Injectable }  from '@angular/core';
/*import { Resource }    from '../model/resource.model';
import { NPCResource } from '../interfaces/interfaces';*/

@Injectable({
	providedIn: 'root'
})
export class ClassMapperService {
	constructor() {}

	/*getResources(response: NPCResource[], idNPC: number) {
		const resources: Resource[] = [];

		for (let r of response) {
			let resource = this.getResource(r, idNPC);
			resources.push(resource);
		}

		return resources;
	}

	getResource(r: NPCResource, idNPC: number) {
		const resource = new Resource(r.resource.id, r.resource.name, r.resource.minPrice, r.resource.maxPrice, r.value, idNPC);
		return resource;
	}*/
}
