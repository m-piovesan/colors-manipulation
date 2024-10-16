import './App.css';
import { useState, useEffect } from 'react';
import { ThemeProvider, DefaultTheme } from 'styled-components';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import { theme as defaultTheme } from './assets/themes';
import { darken, lighten } from 'polished';
import Color from 'color';
import { RGBInput } from './RgbInput'

// Função para formatar valores HSL (ajustar casas decimais)
const formatHslString = (hslString: string) => {
    return hslString.replace(/(\d+\.\d+),/g, (match) => {
        const number = parseFloat(match);
        return `${number.toFixed(1)},`;
    });
};

// Função para extrair os valores de dentro de parênteses
const extractColorValues = (colorString: string) => {
    const regex = /\(([^)]+)\)/;
    const match = regex.exec(colorString);
    return match ? match[1] : "";
};

function App() {
    const [hex, setHex] = useState('#561ecb');
    const [rgb, setRgb] = useState('');
    const [hsl, setHsl] = useState('');
    const [theme, setTheme] = useState<DefaultTheme>(defaultTheme);

    const handleColorChange = () => {
        const lighterSecondary = lighten(0.3, hex);
        const darkerBg = darken(0.3, hex);

        setTheme((prevTheme) => ({
            ...prevTheme,
            colors: {
                ...prevTheme.colors,
                primary: hex,
                secondary: lighterSecondary,
                background: darkerBg,
            },
        }));
    };

    const updateFromHex = (hexValue: string) => {
        if(hexValue.length !== 7) return;
        
        try {
            const color = Color(hexValue);
            setHex(color.hex());
            setRgb(color.rgb().string());
            setHsl(color.hsl().string());
        }
        catch (e) {
            console.error('Invalid HEX format');
        }
    }

    const updateFromRgb = (rgbValue: string) => {
        try {
            const color = Color(`rgb(${rgbValue})`);
            setHex(color.hex());
            setRgb(color.rgb().string());
            setHsl(color.hsl().string());
        } catch (e) {
            console.error('Invalid RGB format');
        }
    };

    const updateFromHsl = (hslValue: string) => {
        try {
            const color = Color(`hsl(${hslValue})`);
            setHex(color.hex());
            setRgb(color.rgb().string());
            setHsl(formatHslString(color.hsl().string()));
        } catch (e) {
            console.error('Invalid HSL format');
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <div>
                <h2 style={{ color: theme.colors.primary }}>cor salva no banco (atual)</h2>
                <h3 style={{ color: theme.colors.secondary }}>cor secundária que está no banco</h3>

                <h2 style={{ color: hex }}>alterando a cor primária</h2>
                <h3 style={{ color: lighten(0.3, hex) }}>alterando cor secundária</h3>

                <label>HEX:</label>
                <HexColorInput color={hex} onChange={updateFromHex} />
                
                <label>RGB:</label>
                <input
                    type="text"
                    value={extractColorValues(rgb)}
                    onChange={(e) => updateFromRgb(e.target.value)}
                />
                <p>{extractColorValues(rgb)}</p>

                <label>HSL:</label>
                <input
                    type="text"
                    value={extractColorValues(formatHslString(hsl))}
                    onChange={(e) => updateFromHsl(e.target.value)}
                />


                <HexColorPicker color={hex} onChange={updateFromHex} />

                <button onClick={handleColorChange} style={{ marginTop: '10px' }}>
                    Enviar
                </button>
            </div>
        </ThemeProvider>
    );
}

export default App;
