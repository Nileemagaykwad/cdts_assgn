import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PagerService } from './index';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'github-app';
  search_string: string;
  searchDataArray: any = [];
  selectedIndex;
  allData: any = [];
  repoArray: any = [];

  // array of all items to be paged
  private allItems: any[];
  // pager object
  pager: any = {};

  // paged items
  pagedItems: any[];

  constructor(
    private http: HttpClient,
    private pagerService: PagerService
  ) { }

  ngOnInit() {

  }

  getData() {
    if (this.search_string == '') {
      return 'please enter user name';
    }
    this.http.get(`https://api.github.com/search/users?q=${this.search_string}`)
      .subscribe((data: any) => {
        console.log(data);
        this.allData = data;
        this.allItems = data.items;
        // initialize to page 1
        this.setPage(1);
      }, error => {
        console.log(error);
      });
  }

  setPage(page: number) {
    // get pager object from service
    this.pager = this.pagerService.getPager(this.allItems.length, page);

    // get current page of items
    this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  openList(index, item) {
    console.log(item);
    this.selectedIndex = index;

    this.http.get(`https://api.github.com/users/${item.login}/repos`)
      .subscribe(data => {
        console.log(data);
        this.repoArray = data;
      }, error => {
        console.log(error);
      })
  }
}
