import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  
  constructor() { }

  ngOnInit(): void {
  }

  slides = [
    {
      image: '../../../assets/images/img-testimonio1.png',
      title: 'Jaime Polo Zuluaga',
      parr: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quisquam sit labore temporibus modi libero, animi error accusamus id dicta nulla voluptatem nihil, facilis tenetur minus.'
    },
    {
      image: '../../../assets/images/img-testimonio2.png',
      title: 'Yesica Martinez Perez',
      parr: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quisquam sit labore temporibus modi libero, animi error accusamus id dicta nulla voluptatem nihil, facilis tenetur minus.'
    },
    {
      image: '../../../assets/images/img-testimonio1.png',
      title: 'Jaime Polo Zuluaga',
      parr: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quisquam sit labore temporibus modi libero, animi error accusamus id dicta nulla voluptatem nihil, facilis tenetur minus.'
    },
   
]

  
}
