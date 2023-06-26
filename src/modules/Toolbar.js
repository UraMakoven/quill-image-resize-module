import Quill from "quill";
import IconAlignLeft from "quill/assets/icons/align-left.svg";
import IconAlignCenter from "quill/assets/icons/align-center.svg";
import IconAlignRight from "quill/assets/icons/align-right.svg";
import { BaseModule } from "./BaseModule";

const Parchment = Quill.imports.parchment;

export class Toolbar extends BaseModule {
	onCreate = () => {
		// Setup Toolbar
		this.toolbar = document.createElement("div");
		Object.assign(this.toolbar.style, this.options.toolbarStyles);
		this.overlay.appendChild(this.toolbar);

		// Setup Buttons
		this._defineAlignments();
		this._addToolbarButtons();
	};

	// The toolbar and its children will be destroyed when the overlay is removed
	onDestroy = () => {};

	// Nothing to update on drag because we are are positioned relative to the overlay
	onUpdate = () => {};

	_defineAlignments = () => {
		this.alignments = [
			{
				icon: IconAlignLeft,
				apply: () => {
					this.img.className = "float-left";
				},
				isApplied: () => this.img.classList.contains("float-left"),
			},
			{
				icon: IconAlignCenter,
				apply: () => {
					this.img.className = "";
				},
				isApplied: () => false,
			},
			{
				icon: IconAlignRight,
				apply: () => {
					this.img.className = "float-right";
				},
				isApplied: () => this.img.classList.contains("float-right"),
			},
		];
	};

	_addToolbarButtons = () => {
		const buttons = [];
		this.alignments.forEach((alignment, idx) => {
			const button = document.createElement("span");
			buttons.push(button);
			button.innerHTML = alignment.icon;
			button.addEventListener("click", () => {
				// deselect all buttons
				buttons.forEach((button) => (button.style.filter = ""));
				if (alignment.isApplied()) {
					this.img.className = "";
				} else {
					// otherwise, select button and apply
					this._selectButton(button);
					alignment.apply();
				}
				// image may change position; redraw drag handles
				this.requestUpdate();
			});
			Object.assign(button.style, this.options.toolbarButtonStyles);
			if (idx > 0) {
				button.style.borderLeftWidth = "0";
			}
			Object.assign(
				button.children[0].style,
				this.options.toolbarButtonSvgStyles
			);
			if (alignment.isApplied()) {
				// select button if previously applied
				this._selectButton(button);
			}
			this.toolbar.appendChild(button);
		});
	};

	_selectButton = (button) => {
		button.style.filter = "invert(20%)";
	};
}
