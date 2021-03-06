/*
WindowSetup Class
-------------
- This class provides basic features to make a <div> function similar to a desktop window.
- Features include: Dragging, resizing, bring to front, close, minimize, full screen.
*/

class WindowSetup
{


    constructor(_windowId)
    {
        this.window = _windowId;

        // Window content
        this.windowTitle = "Window Title";
        this.windowContent = "Window Content";

        // Initial window sizing
        this.minWidth = 300;
        this.minHeight = 200;
        this.width = "50em";
        this.height = "25em";

        // Fullscreen swapping 
        this.fullScreen = false;
        this.lastX = 0;
        this.lastY = 0;
        this.lastWidth = "50em";
        this.lastHeight = "25em";
        this.transitionTime = 0.3;

        // Launcher
        this.launcher = "body";

        // Containment that windows can't be dragged out of
        this.containment = "body";
        $(this.containment).css("position", "relative");

        // Run constantly
        $( () =>
        {
            // Insert "dynamic" HTML and CSS into the window
            $(this.window).addClass("window");
            $(this.window).css("position", "absolute"); // Must add this in js because jQuery UI overwrites with position:relative
            $(this.window).html( this.drawWindow() );

            // Minimize, toggle, close
            this.titleBarFunctions();
        });
    }


    /*
    Setters
    --------
    */
    
    setTitle(_title)
    {
        this.windowTitle = _title;
    }

    setSize(_minWidth, _minHeight, _width, _height)
    {
        this.minWidth = _minWidth;
        this.minHeight = _minHeight;
        this.width = _width;
        this.height = _height;
    }

    setContent(_content)
    {
        this.windowContent = _content;
    }

    setContainment(_containment)
    {
        this.containment = _containment;
    }

    setLauncher(_launcher)
    {
        this.launcher = _launcher;
    }


    /*
    Draw Window
    ------------
    */

    drawWindow()
    {
        var _html = `
            <!-- Window bar -->
            <div class='window-bar'>

                <div class='row h-100'>
                    <!-- Left Placeholder/Padding -->
                    <div class='col'>

                    </div>
                    <!-- Title -->
                    <div class='col h-100 d-flex justify-content-center align-items-center'>
                        <p>` + this.windowTitle + `</p>
                    </div>
                    <!-- Buttons -->
                    <div class='col h-100 d-flex justify-content-end'>
                        <span id='window-minimize'><i class='fas fa-minus fa-xs'></i></span>
                        <span id='window-toggle'><i class='far fa-square fa-xs'></i></span>
                        <span id='window-close'><i class='fas fa-times-circle' style='color: rgb(223, 74, 22);'></i></span>
                    </div>
                </div>

            </div>

            <!-- Window Content -->
            <div class='window-content'>
                ` + this.windowContent + `
            </div>
        `;

        return _html;
    }

    
    /*
    Responsive Features
    --------------------
    */

    // Enable dragging and resize
    dragAndResize(_containment)
    {
        $( this.window ).draggable({
            containment: this.containment,
            scroll: false,
            start: () =>
            {
                this.bringToFront();
            }
        }).resizable({
            minWidth: this.minWidth,
            minHeight: this.minHeight,
        }).on('click', () => {
            this.bringToFront();
        });
    }

    // Bring the clicked on window to the front of all windows!
    bringToFront()
    {
        $('.window').css("z-index", "1");
        $(this.window).css("z-index", "2");
    }


    /*
    Title Bar Functions
    --------------------
    */

    // Close the window
    titleBarFunctions()
    {
        // Close window
        $(this.window + " #window-close").on('click', () =>
        {
            $(this.window).remove();
        });

        // Toggle window size
        $(this.window + " #window-toggle").on('click', () =>
        {
            // Up the transition speed, and reset it back to zero for smooth dragging
            $(this.window).css("transition", String(this.transitionTime) + "s");
            setTimeout( () => { $(this.window).css("transition", "0s"); }, (this.transitionTime * 100) );

            switch (this.fullScreen)
            {
                case false:
                    // FULLSCREEN
                    // Store the size and position vars
                    this.lastX = $(this.window).css("left");
                    this.lastY = $(this.window).css("top");
                    this.lastWidth = $(this.window).css("width");
                    this.lastHeight = $(this.window).css("height");
                    // Make the window fullscreen
                    $(this.window).css("left", "0");
                    $(this.window).css("top", "0");
                    $(this.window).css("width", "100%");
                    $(this.window).css("height", "100%");
                    $(this.window).css("position", "relative");
                    // Remove border
                    $(this.window).css("border", "0");
                    $(this.window).css("border-radius", "0");
                    $(this.window + " .window-bar").css("border-radius", "0");
                    // Change this var
                    this.fullScreen = true;
                    break;
                case true:
                    // WINDOWED
                    // Make the window windowed and set to last pos and size
                    $(this.window).css("left", this.lastX);
                    $(this.window).css("top", this.lastY);
                    $(this.window).css("width", this.lastWidth);
                    $(this.window).css("height", this.lastHeight);
                    // Add the border back
                    $(this.window).css("border", "1px solid rgb(41, 32, 35)");
                    $(this.window + " .window-bar").css("border-radius", "5px");
                    $(this.window).css("border-radius", "5px");
                    // Change this var
                    this.fullScreen = false;
                    break;
            }
        });
        
        // Minimize window
        $(this.window + " #window-minimize").on('click', () =>
        {
            // Up the transition speed
            $(this.window).css("transition", String(this.transitionTime) + "s");

            // Shrink and disappear
            $(this.window).css("opacity", "0");
            $(this.window).css("height", "100");
            
            // Move to bottom
            $(this.window).css("z-index", "0");
        });
        
    }


}


/*
Window Class
--------
*/

class Window extends WindowSetup
{
    constructor(_windowId)
    {
        super(_windowId);

        $( () =>
        {
            // Make windows draggable. MUST BE LAST
            this.dragAndResize();
        });
    }
}
