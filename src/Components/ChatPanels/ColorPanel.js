import React from 'react';

import { Sidebar, Menu, Divider, Button } from 'semantic-ui-react';

class ColorPanel extends React.Component {
    render() {
        return (
            <div>
                <Sidebar as = {Menu} icon="labeled" inverted visible vertical width = "very thin">
                    <Divider />
                    <Button icon = "add" size = "small" color = "blue" />
                </Sidebar>
            </div>
        )
    }
}

export default ColorPanel;