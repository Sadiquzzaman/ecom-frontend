import { NgModule } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
// import { LayoutModule } from '@angular/cdk/layout';
// import { MatButtonModule } from '@angular/material/button';
// import { MatButtonToggleModule } from '@angular/material/button-toggle';
// import { MatCardModule } from '@angular/material/card';
// import { MatCheckboxModule } from '@angular/material/checkbox';
// import { MatNativeDateModule } from '@angular/material/core';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatDialogModule } from '@angular/material/dialog';
// import { MatDividerModule } from '@angular/material/divider';
// import { MatExpansionModule } from '@angular/material/expansion';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatGridListModule } from '@angular/material/grid-list';
// import { MatIconModule } from '@angular/material/icon';
// import { MatInputModule } from '@angular/material/input';
// import { MatListModule } from '@angular/material/list';
// import { MatMenuModule } from '@angular/material/menu';
// import { MatPaginatorModule } from '@angular/material/paginator';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { MatRadioModule } from '@angular/material/radio';
// import { MatSelectModule } from '@angular/material/select';
// import { MatSidenavModule } from '@angular/material/sidenav';

// import { MatSortModule } from '@angular/material/sort';
// import { MatStepperModule } from '@angular/material/stepper';
// import { MatTableModule } from '@angular/material/table';
// import { MatTabsModule } from '@angular/material/tabs';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { MatTooltipModule } from '@angular/material/tooltip';
// import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
// import { MaterialFileInputModule } from 'ngx-material-file-input';
// import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
// import { MatAutocompleteModule } from '@angular/material/autocomplete';
// import { MatChipsModule } from '@angular/material/chips';
// import { MatProgressBarModule } from '@angular/material/progress-bar';
// import { MatBadgeModule } from '@angular/material/badge';

const materialModules = [
  // LayoutModule,
  // MatButtonModule,
  // MatCardModule,
  // MatCheckboxModule,
  // MatDividerModule,
  // MatIconModule,
  // MatInputModule,
  // MatMenuModule,
  // MatSidenavModule,
  // MatTableModule,
  // MatTabsModule,
  // MatToolbarModule,
  // MatFormFieldModule,
  // MatRadioModule,
  // MatDatepickerModule,
  // MatTooltipModule,
  // MatStepperModule,
  // MatListModule,
  // MatSelectModule,
  // MatPaginatorModule,
  // MatSortModule,
  // MatExpansionModule,
  // MatPaginatorModule,

  // MatProgressSpinnerModule,
  MatSnackBarModule,
  // NgxMatSelectSearchModule,
  // MatNativeDateModule,
  // MatDialogModule,
  // MaterialFileInputModule,
  // MatButtonToggleModule,

  // MatGridListModule,
  // NgxMaterialTimepickerModule,
  // MatAutocompleteModule,
  // MatChipsModule,
  // MatProgressBarModule,
  // MatBadgeModule,
];

@NgModule({
  declarations: [],
  imports: [materialModules],
  exports: [materialModules],
  // providers: [MatDatepickerModule, NgxMaterialTimepickerModule],
})
export class BasicMaterialModule {}
