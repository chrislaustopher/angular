import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

	dish: Dish;
  dishErrMess: string;
	promotion: Promotion;
  leader: Leader;

  constructor(private dishService: DishService, 
  	private promotionService: PromotionService,
    private leaderService: LeaderService,
    @Inject('BaseURL') public BaseURL) { 
    
  	this.dishService.getFeaturedDish()
      .subscribe((dish) => this.dish = dish, disherrmess => this.dishErrMess = <any>disherrmess);
  	this.promotionService.getFeaturedPromotion()
      .then((promotion) => this.promotion = promotion);
    this.leaderService.getFeaturedLeader()
      .then((leader) => this.leader = leader);
  }

  ngOnInit(): void {
  }

}
