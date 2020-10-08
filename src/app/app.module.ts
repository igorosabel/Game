import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule }             from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TokenInterceptor }        from './interceptors/token.interceptor';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { PAGES, COMPONENTS, PIPES, SERVICES } from './app.common';

@NgModule({
	declarations: [
		AppComponent,
		...PAGES,
		...COMPONENTS,
		...PIPES
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		FormsModule,
		BrowserAnimationsModule
	],
	providers: [
		...SERVICES,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: TokenInterceptor,
			multi: true
		}
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
