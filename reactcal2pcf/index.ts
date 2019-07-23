import {IInputs, IOutputs} from "./generated/ManifestTypes";
import * as React from 'react'
import ReactDOM = require("react-dom");
import {CalendarInlineExample,ICalendarInlineExampleProps} from './reactcal2pcf'

export class reactcal2pcf implements ComponentFramework.StandardControl<IInputs, IOutputs> {
	 // Reference to the notifyOutputChanged method
	private _notifyOutputChange:()=>void;
	  // Reference to the container div
	private _container: HTMLDivElement;
	// Reference to the React props 
	private props: ICalendarInlineExampleProps={
		dateRangeType: 0,
		autoNavigateOnSelection: false,
		showGoToToday: false,
		dateSelected:new Date(),
		dateOnchange: this.notifyChange.bind(this)//==> bound event handler.(notifyChange)
	}
	/**
	 * Empty constructor.
	 */
	constructor()
	{
	}
	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='starndard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
	{
		// Add control initialization code
		this._notifyOutputChange = notifyOutputChanged;
		this.props.dateSelected =  context.parameters.sampleDateProperty.raw;
		this._container = container;	
	}
	/**
	 * Called when any value in the property bag has changed. 
	 * This includes field values, data-sets, 
	 * global values such as container height and width, 
	 * offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; 
	 * It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		// Add code to update control view
		if (context.updatedProperties.includes("sampleDateProperty")) this.props.dateSelected = context.parameters.sampleDateProperty.raw;
		ReactDOM.render(
			React.createElement(
				CalendarInlineExample,
				this.props
				),
			this._container, 
		);
	}
	
	//only update if date has changed.
	notifyChange(d:Date){
		if (this.props.dateSelected !== d){
			this.props.dateSelected = d;
			this._notifyOutputChange();
		}
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
		return {
			sampleDateProperty: this.props.dateSelected
		};
	}
	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
		// Add code to cleanup control if necessary
		ReactDOM.unmountComponentAtNode(this._container);
	}
}