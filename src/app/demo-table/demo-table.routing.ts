import {NgModule}                from '@angular/core';
import {RouterModule, Routes}    from '@angular/router';
import {DemoTableComponent} from "./demo-table.component";


const demoRoutes: Routes = [
    {
        path: '',
        component: DemoTableComponent
    },
];
@NgModule({
    imports: [
        RouterModule.forChild(demoRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class DemoRoutingModule {

}

