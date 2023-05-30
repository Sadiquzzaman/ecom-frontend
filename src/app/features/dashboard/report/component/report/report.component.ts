import { Component, OnInit } from '@angular/core';

export interface ReportElement {
  serialNumber: number;
  image: string;
  productName: string;
  productId: string;
  inTime: Time;
  inStock: number;
  revenue: number;
  action: string;
}

export interface Time {
  date: string;
  time: string;
}

export interface Action {
  eye: string;
  delete: string;
}

const ELEMENT_DATA: ReportElement[] = [
  {
    serialNumber: 1,
    image: '../../../../../../assets/images/product-1620542949771.jpeg',
    productName: 'Product Name',
    productId: 'ABCDE',
    inTime: {
      date: '22 March,2021',
      time: '9:45 PM',
    },
    inStock: 55,
    revenue: 5555555,
    action: '',
  },
  {
    serialNumber: 2,
    image: '../../../../../../assets/images/product-1620542949771.jpeg',
    productName: 'Product Name',
    productId: 'ABCDE',
    inTime: {
      date: '22 March,2021',
      time: '9:45 PM',
    },
    inStock: 55,
    revenue: 5555555,
    action: '',
  },
  {
    serialNumber: 3,
    image: '../../../../../../assets/images/product-1620542949771.jpeg',
    productName: 'Product Name',
    productId: 'ABCDE',
    inTime: {
      date: '22 March,2021',
      time: '9:45 PM',
    },
    inStock: 55,
    revenue: 5555555,
    action: '',
  },
  {
    serialNumber: 4,
    image: '../../../../../../assets/images/product-1620542949771.jpeg',
    productName: 'Product Name',
    productId: 'ABCDE',
    inTime: {
      date: '22 March,2021',
      time: '9:45 PM',
    },
    inStock: 55,
    revenue: 5555555,
    action: '',
  },
  {
    serialNumber: 5,
    image: '../../../../../../assets/images/product-1620542949771.jpeg',
    productName: 'Product Name',
    productId: 'ABCDE',
    inTime: {
      date: '22 March,2021',
      time: '9:45 PM',
    },
    inStock: 55,
    revenue: 5555555,
    action: '',
  },
];

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit {
  displayedColumns: string[] = [
    'serialNumber',
    'image',
    'productName',
    'productId',
    'inTime',
    'inStock',
    'revenue',
    'action',
  ];
  dataSource = ELEMENT_DATA;

  constructor() {}

  ngOnInit(): void {}
}
