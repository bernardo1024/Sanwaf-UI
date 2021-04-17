# Sanwaf Framework Overview
 Sanwaf is a declarative data validation framework that secures your UI & Server without writing any code

- [Sanwaf-UI](https://github.com/bernardo1024/Sanwaf-UI) is a Sanitation Web Application Firewall that runs on the Browser
        
        - Uses a declarative mechanism to add validation to HTML pages
        - Add validation to a UI elements by including custom Sanwaf-UI Attributes
        - Fully configurable look and feel
        - No custom code is required to perform validation on web pages

-  [Sanwaf-Server](https://github.com/bernardo1024/Sanwaf-Server) is a Sanitation Web Application Firewall that runs on the Server
        
        - Sanwaf-Server secures parameters, cookies, headers and endpoints prior to entering your application code
        - Sanwaf-Server is configured with an XML file
        - Can be used independently of Sanwaf-UI
        - No custom code is required to perform validation on the server

- [Sanwaf-UI-2-Server](https://github.com/bernardo1024/Sanwaf-UI-2-Server) utility converts the Sanwaf-UI declarative validation into the server XML format
        
        - Provides for effortless Sanwaf-Server configuration using Sanwaf-UI attributes
        - Converts the Sanwaf-UI declarative Attributes into a Sanwaf-Server consumable form
        - Automate Sanwaf-Server configuration using this utility
  
- [Sanwaf-Sample](https://github.com/bernardo1024/Sanwaf-Sample) project is a sample implementation of Sanwaf-UI and Sanwaf Server

        - End-2-end sample of using Sanwaf-UI & Sanwaf-Server
        - Dynamically configure and test Sanwaf-UI 
        - Dynamically disable Browser Validation and run against Server (uses embedded Jetty)

# Sanwaf-UI

Sanwaf-UI provides a standardized, tested, and simple to implement validation framework so you dont have to write custom validation code again.  

When Sanwaf-UI is used with Sanwaf-Server, they provide a code-free declarative validation system on both the client & server.

![](sanwaf-ui.png)  
  
**See [sanwaf-ui-demo.html](https://bernardo1024.github.io/) for examples**

Implementing Sanwaf-ui & Sanwaf-server
===============================

1. Configure Sanwaf-ui on html pages

2. Run the Sanwaf-ui-2-server script to generate XML consumed by Sanwaf-Server for server-side validation

3. [Add Sanwaf-Server](https://github.com/bernardo1024/Sanwaf-Server) to your application


Configuring Sanwaf-ui
---------------------

View the source of this page to and search for "Sanwaf-ui code - STEP" to see examples of configuring sanwaf-ui (all 6 steps)  
  
![](sanwaf-ui-components.png)

1. Import sanwaf-ui.js lib

        <script src="[sanwaf-ui.js](sanwaf-ui.js)"></script>
        
      this makes the sanwaf-ui code available for use on your page

2. import sanwaf-ui CSS (optional)

        <link rel="stylesheet" type="text/css" href="[sanwaf-ui.css](sanwaf-ui.css)" media="screen" />
        
    to specify custom classes see the [sanwafuiconfig](#sanwaf-ui-config) hidden element

3. Configure sanwaf-ui (optional)

    add a hidden element named "[**sanwafuiconfig**](#sanwaf-ui-config)" & configure Sanwaf-ui

4. Set [sanwaf-ui attributes](#sanwaf-ui-attributes) to your html elements requiring validation

        <input
		type="text" id="carModel" name="carModel"
		data-sw-display="Car Model"
		data-sw-type="s"
		data-sw-max="30"
		data-sw-max-value="100"
		data-sw-min="0"
		data-sw-min-value="0"
		data-sw-req="true"
		data-sw-related="haveCar:Yes"
		data-sw-err-msg="Car Model must be entered if you own a car"
        />

    see [sanwaf-ui attribute](#sanwaf-ui-attributes) for details

5a. Call Sanwaf-ui method to validate a form

	To check all elements on a form for errors, use:

		isSanwafUiFormValid(form)

	To perform validation on a single element, use:

        	sanwafUiBlurElement(element)
	
	**See [sanwaf-ui-demo.html](https://bernardo1024.github.io/) for examples**

5b. OR Call Sanwaf-ui method to get errors in JSON format

	To get all errors found for a given form in JSON format, use:

        	getFormErrors(form)

	To get errors for a given element in JSON format, use: 

        	getElementErrors(element)

6. Initialize sanwaf-ui

        <script> initSanwafui(); </script>

	The script scans HTML for sanwaf-ui attributes setting events on elements

  
  
# sanwaf-ui-config

The "sanwafuiconfig" Hidden Element
-----------------------------------

A hidden "**sanwafuiconfig**" element is used to configure the Sanwaf-ui behavior  
  
**Optional Control Attributes**  

  	numErrorsToDisplay  		- Number of error messages to display. Specify -1 to display all errors. 
					  Defaults to: -1
  	errorActions                  	- Action(s)s to take when an error is found on a submit.  
					  Defaults to: hoverOnLabel,hoverShowLabel,colorLabel,colorInput,onFocusDisableColors,showOnPage,showOnPageSanwafTable,alertWithPopup
	blurActions                  	- Action(s) to take when a field is blurred.  
	 				  Defaults to: hoverOnLabel,hoverShowLabel,colorLabel,colorInput,onFocusDisableColors 
  	showOnPageElementId             - Optional element to wrap the sanwaf-ui errors that will be made visible if errors are detected. 
					  Defaults to: sanwafuierrorwrapper
  	showOnPageSanwafTableElementId  - Optional element to set a table of sanwaf-ui errors (configurable by css).  
					  Defaults to: sanwafuierrortable

**Optional CSS Class Overrides**  

Use your own CSS classes by setting the following attributes to classes defined in your CSS

	labelClass 			- Sets the color for the label of the error'd element
	inputClass 			- Sets the color of the input text of the error'd element
	tooltipClass 			- The tooltip css class applied to the label
	tooltipTextClass 		- Tooltip text css specification
	sanwafErrorTableClass 		- When displaying errors on the page, a table in inserted using this css class
	sanwafErrorTableTdKeyClass 	- The css class for the key section of the sanwaf-ui error table
	sanwafErrorTableTdDescClass 	- The css class for the value section of the sanwaf-ui error table


**Optional Error Message Attributes** (default values will be used if not specified)

	data-errorPopHeader1 			- header line 1 used with pop-up dialog
	data-errorPopHeader2 			- header line 2 used with pop-up dialog
	data-errorRequired 			- Error message for **Required** violations
	data-errorMax 				- Error message for **Max Length** violations
	data-errorMin 				- Error message for **Min Length** violations
	data-errorMaxMinEqual 			- Error message for when Min & Max length are equal
	data-errorMaxValue 			- Error message for **Max Value** violations
	data-errorMinValue 			- Error message for **Min Value** violations
	data-errorRelated 			- Error message for **Relationship** violations
	data-errorTypeChar 			- Error message for **Character** data type violations
	data-errorTypeNumeric 			- Error message for **Numeric** data type violations
	data-errorTypeNumericDelimited 		- Error message for **Numeric Delimited** data type violations
	data-errorTypeAlphanumeric 		- Error message for **Alphanumeric** data type violations
	data-errorTypeAlphanumericAndMore 	- Error message for **Alphanumeric and more** data type violations
	data-errorTypeConstant 			- Error message for **Constant** data type violations
	data-errorTypeRegex 			- Error message for **Regex** data type violations
	data-errorTypeFormat 			- Error message for **Format** violations

  

ErrorActions & BlurActions
--------------------------

The following error actions can be used individually or cumulatively.

For example:

to set the display type to have the error message hover on the label and change the labels color:

    displayType="hoverlabel,colorlabel"

**Actions**

	hoverOnLabel 		- Add a hover element to you label that is associated with the 'for=' attribute of the label.
	hoverShowLabel 		- Include the associated label text in the hover message
	colorLabel 		- Change the color of the label 
	colorInput 		- Change the color of the input element 
	onFocusDisableColors 	- When an element gets focus, remove all error coloring (element & label)
	showOnPage 		- Element id to be made visible if an error is detected (to provide custom message)
	showOnPageSanwafTable 	- Element id to insert the Sanwaf-ui table of errors
	alertWithPopup 		- Show an alert dialog containing the Sanwaf-ui errors

  
  
# sanwaf-ui-attributes

Sanwaf-ui Elements Attributes
-----------------------------

	data-sw-display 	- Name Associated with the widget that will be used for display in error messages.
	data-sw-type 		- Data type of the element
	data-sw-req 		- Makes the element a mandatory field
	data-sw-max 		- Maximum character limit
	data-sw-min 		- Minimum character limit
	data-sw-max-value 	- Maximum value for the given type
	data-sw-min-value 	- Minimum value for the given type
	data-sw-related		- Relate fields. format: \[related-to-element:type\] where type is '=' or 'value'
	data-sw-err-msg 	- Custom error message (overrides global msgs)
 

data-sw-type (data types)
-------------------------

	Character (c) 	 			Any single character
						Format: c
						Example: y, n, a, b...

	Numeric (n)				Any positive or negative numeric value
					  	('+' sign NOT allowed; one '-' sign allowed @start of value; no spaces; one '.' allowed)
					  	Format: n
					  	Example: 1000, -321.123, 0.0001

	Delimited list of numbers (n{}) 	A character separated list of numbers
						Format: n{<separator char>}  
						Note: the min & max settings applies per delimited value
						Example: using n{,}, -321.123,0.000,123,45

	Alphanumeric (a)			Valid chars are A-Z, a-z, 0-9
						Format: a
						Example: abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ

	Alphanumeric & more chars (a{})		Valid chars are A-Z, a-z, 0-9 \*AND\* the characters you specify in the curly brackets  
						For \[space\], \[tab\], \[newline\], \[carriage return\] use: \\s \\t \\n \\r respectively
						Format: a{<characters to allow>}
						Example: using a{+\\s,}, abcdefghijklm nopqrstuvwxyz+

	String (s)				Any string  
						All server side regex's in the autoRunPatterns are executed against the string
						Format: s
						Example: "Hello this string does not contain a XSS payload"

	Constant (k{})				Constant, must be equal to one of the values specified
						Format: k{<comma separated list of strings>}
						Example: using k{FOO,BAR,FAR}, FOO, BAR, FAR are valid

	Regex (r{})				Custom Regex Expression in this file (for reuse)
						Format: r{your-regex}
						Example: r{ ^\[^\\s@\]+@\[^\\s@\]+$ } 
	
	Format (f{}) 				Tries to best fit the data entered into the supplied mask
						Format	f{(###) ###-####}
						Example	using f{(###) ###-####, (555) 123-4567 is valid


### Sanwaf-ui Format Data Type
--------------------------
The Format data type sets the element to use a Format

A Format is way to best fit a user's entry into a mask

Sanwaf-ui automatically sets an oninput event handler to elements that have the data-ww-format attribute. the event handler formats as the user enters data

Four special characters are provided to be used in formats:

	  # - represents a number
	  A - represents an Uppercase character
	  a - represents an lowercase character
	  c - represents a character of any case

Use a combination of the special and non-special characters to create formats

To use the four special characters in the format itself, you will need to escape them:

	\#  \A  \a  \c

For example, if you want the end user to enter a telephone number formatted in a specific way:

	data-sw-type="f{(###) ###-####}"

  this specifies to best fist a user's entry into the specified mask.



### Sanwaf-ui Attribute 'data-sw-related' - Element Relationships
--------------------------
The "data-sw-related" attribute sets element relationships. Use this attribute to specify which fields are mandatory based on other related elements

For example, if you want 2 password fields, pass1 & pass2, to equal each other, you would set the "data-sw-related" attribute in pass2 as such:

	data-sw-related="pass1:="

  this specifies that pass2 is required if pass1 is populated, and their values must equal each other.

Relationships have a 2 part format:

	RelatedToElementPart : RelationshipSpecificationPart

Where "RelatedToElementPart" is the element id of the related field and "RelationshipSpecificationPart" is one of:

	none 		- ":relationshipSpecificationPart" NOT specified makes the element required if the RelatedToElementPart has any value  
  			  Example: data-sw-related="someElement"

	=		- Makes the element required if the RelatedToElementPart is populated; values must equal each other  
  			  Example: data-sw-related="password : ="

	value		- Makes the element required if the RelatedToElementPart.value equals the value specified  
  			  Example: data-sw-related="someElement : someValue"

	value1||value2	- Makes the element required if the RelatedToElementPart.value equals any of the value specified  
  			  Example: data-sw-related="someElement : value1 || value2"

For complex relationships, encapsulate the 2 part format with parenthesis's "( RelatedToElementPart : RelationshipSpecificationPart )" 
and specify the && and/or the || operators

For example:   

	data-sw-type="( element1 : value1 || value2 ) || ( element2 : value1 || value2 ) && ( element3 : value1 || value2 )..."

 


Configuring how Sanwaf-ui Looks: Sanwaf-ui.css
----------------------------------------------

Use the sanwaf-ui.css file to configure the look and feel of sanwaf-ui in your application  
You can override all of the classes defined in the sanwaf-ui.css file by overriding them in the [sanwafuiconfig](#sanwafuiconfig) hidden element


	sanwafuiLabel 				- Sets the color for the label of the error'd element
	sanwafinput 				- Sets the color of the input text of the error'd element
	sanwafuiErrorTable 			- When displaying errors on the page, a table in inserted using this css class
	sanwafuiErrorTableTdKey 		- The <td> css class for the key section of the sanwaf-ui error table
	sanwafuiErrorTableTdDesc 		- The <td> css class for the value section of the sanwaf-ui error table
	sawafuiTooltip 				- The tooltip css class applied to the label
	sawafuiTooltip .tooltiptext 		- Tooltip text css specification
	sawafuiTooltip .tooltiptext::after	- Tooltip after specification
	sawafuiTooltip:hover .tooltiptext 	- Tooltip hover specification

