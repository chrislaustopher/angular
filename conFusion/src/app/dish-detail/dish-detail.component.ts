import { Component, OnInit, Input, Inject } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-dish-detail',
  templateUrl: './dish-detail.component.html',
  styleUrls: ['./dish-detail.component.scss']
})
export class DishDetailComponent implements OnInit {

	dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  errMess: string;

  	constructor(private dishService: DishService, 
  		private route: ActivatedRoute,
  		private location: Location,
      //private fb: FormBuilder,
      @Inject('BaseURL') public BaseURL) { }

  	ngOnInit(): void {
      //this.createForm();

      this.dishService.getDishIds()
        .subscribe((dishIds) => this.dishIds = dishIds);
  		this.route.params.pipe(
        switchMap((params: Params) => this.dishService.getDish(params['id'])))
        .subscribe((dish) => { this.dish = dish; this.setPrevNext(dish.id); },
          errmess => this.errMess = <any>errmess);
  	}

    setPrevNext(dishID: string) {
      const index = this.dishIds.indexOf(dishID);
      this.prev = this.dishIds[(this.dishIds.length + index - 1)%this.dishIds.length];
      this.next = this.dishIds[(this.dishIds.length + index + 1)%this.dishIds.length];
    }

  	goBack(): void {
  		this.location.back();
  	}
}
