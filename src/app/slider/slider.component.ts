import { Component, OnInit, Input, HostListener, ElementRef, OnDestroy } from '@angular/core';
import { Slider } from './class/slider';
import { ISliderConfig } from './interface/slider-config';
import { ISlide } from './interface/slide';

@Component({
	// tslint:disable-next-line:component-selector
	selector: 'ngx-slider',
	templateUrl: './slider.component.html',
	styleUrls: [ './slider.component.css' ]
})
export class SliderComponent implements OnInit {
	@Input() init: Slider;

	public sliderItems: Array<ISlide>;
	public config: ISliderConfig;
	public componentWidth: number;
	public currentItemIndex: number;
	public activeTitle: string;
	public sliderStyle: any;
	public slideStyle: any;
	public interval: any;
	constructor(public el: ElementRef) {
		this.currentItemIndex = 0;
		this.activeTitle = '';
	}

	ngOnInit() {
		this.sliderItems = this.init.items;
		this.config = this.init.config;
		this.setTitle();
		this.resize();
		this.setSliderStyle();
		this.interval = setInterval(() => {
			this.goTo('next');
		}, 10000);
	}

	@HostListener('window:resize', [ '$event.target' ])
	onResize() {
		this.resize();
	}

	private resize() {
		this.componentWidth =
			this.el.nativeElement.parentElement.clientWidth - this.getPreviewWidth() * this.getNumberOfPreview();
		this.setSlideStyle();
	}

	private setSliderStyle(): void {
		const width = `${this.getWrapperWidth()}px`;
		const left = this.getWrapperLeft() ? `-${this.getWrapperLeft() - this.getPreviewWidth()}px` : 0;

		this.sliderStyle = {
			width: width,
			left: left,
			transition: `next ${this.config.transitionDuration}s`
		};
	}

	private setSlideStyle(): void {
		this.slideStyle = {
			width: `${this.componentWidth}px`
		};
	}

	private setTitle(): void {
		this.activeTitle = this.sliderItems.length ? this.sliderItems[this.currentItemIndex].title : '';
	}

	private getNumberOfPreview(): number {
		return this.config.showPreview ? this.config.numberOfPreview : 0;
	}

	private getPreviewWidth(): number {
		return this.config.showPreview ? this.config.previewWidth : 0;
	}

	private getWrapperWidth(): number {
		return this.sliderItems.length ? this.sliderItems.length * this.componentWidth : this.componentWidth;
	}

	private getWrapperLeft(): number {
		return this.currentItemIndex * this.componentWidth;
	}

	private goTo(action: any): void {
		if (action === 'next') {
			if (this.sliderItems.length - 1 > this.currentItemIndex) {
				this.currentItemIndex++;
			} else {
				this.currentItemIndex = this.config.loop ? 0 : this.currentItemIndex;
			}
		} else if (action === 'previous') {
			if (this.currentItemIndex > 0) {
				this.currentItemIndex--;
			} else {
				this.currentItemIndex = this.config.loop ? this.sliderItems.length - 1 : this.currentItemIndex;
			}
		} else {
			this.currentItemIndex = action;
		}
		this.setSliderStyle();
		this.setTitle();
	}

	ngOnDestroy() {
		if (this.interval) {
			clearInterval(this.interval);
		}
	}
}
