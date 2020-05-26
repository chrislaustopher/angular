import { Component, OnInit, Input, Inject, ViewChild } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { switchMap } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, NgForm, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { Comment } from '../shared/comment';

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
  dishcopy: Dish;
  comment: Comment;
  commentForm: FormGroup;
  @ViewChild('formDirective') private formDirective: NgForm;

  formErrors = {
    'author': '',
    'comment': ''
  };

  validationMessages= {
    'author': {
      'required': 'Author Name is required',
      'minlength': 'Author Name must be at least 2 characters',
    },
    'comment': {
      'required': 'Comment is required.'
    }
  };

  	constructor(private dishService: DishService, 
  		private route: ActivatedRoute,
  		private location: Location,
      private fb: FormBuilder,
      @Inject('BaseURL') public BaseURL) { }

  	ngOnInit(): void {
      this.createForm();

      this.dishService.getDishIds()
        .subscribe((dishIds) => this.dishIds = dishIds);
  		this.route.params.pipe(
        switchMap((params: Params) => this.dishService.getDish(params['id'])))
        .subscribe((dish) => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); },
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

    createForm() {
      this.commentForm = this.fb.group({
        author: ['', [Validators.required, Validators.minLength(2)]],
        rating: 5,
        comment: ['', Validators.required]
      })

      this.commentForm.valueChanges
        .subscribe(data => this.onValueChanged(data));

      this.onValueChanged() // (re)set validation messages
    }

    onSubmit() {
      this.comment = this.commentForm.value;
      this.comment.date = new Date().toISOString();
      console.log(this.comment);
      this.dishcopy.comments.push(this.comment);
      this.dishService.putDish(this.dishcopy)
        .subscribe(dish => {
          this.dish = dish; this.dishcopy = dish;
        },
        errmess => { this.dish = null; this.dishcopy = null; this.errMess = <any>errmess; });
      this.formDirective.resetForm();
      this.commentForm.reset({
        author: '',
        rating: 5,
        comment: ''
      });
    }

    onValueChanged(data?: any) {
      if (!this.commentForm) { return; }
      const form = this.commentForm;
      for (const field in this.formErrors) {
        if (this.formErrors.hasOwnProperty(field)) {
          // clear previous error message (if any)
          this.formErrors[field] = '';
          const control = form.get(field);
          if (control && control.dirty && !control.valid) {
            const messages = this.validationMessages[field];
            for (const key in control.errors) {
              if (control.errors.hasOwnProperty(key)) {
                this.formErrors[field] += messages[key] + ' ';
              }
            }  
          }
        }
      }
    }
}






