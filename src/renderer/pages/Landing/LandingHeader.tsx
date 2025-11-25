import classNames from 'classnames';
import { Link } from 'react-router';
import { useState, useEffect, FC, KeyboardEvent } from 'react';
import { saveConfig } from '../../lib/inputSanitizer';
import { Language } from '../../../localization/type';

interface LandingHeaderProps {
  toggleDrawer: () => void;
  hasNewUpdate: boolean;
  handleMenuOnKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
  isConnected: boolean;
  isLoading: boolean;
  appLang: Language;
}

const LandingHeader: FC<LandingHeaderProps> = ({
  handleMenuOnKeyDown,
  hasNewUpdate,
  toggleDrawer,
  isConnected,
  isLoading,
  appLang,
}) => {
  const [showPasteOption, setShowPasteOption] = useState(false);
  const [clipboardContent, setClipboardContent] = useState<string | null>(null);
  const [showHiddenIcons, setShowHiddenIcons] = useState(false);

  const checkClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.toLowerCase().startsWith('oblivion://')) {
        setShowPasteOption(true);
        setClipboardContent(text);
      } else {
        setShowPasteOption(false);
      }
    } catch (err) {
      //console.error('Error reading clipboard:', err);
    }
  };

  useEffect(() => {
    const handleFocus = () => {
      checkClipboard();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+Shift+Enter combination
      if (e.ctrlKey && e.shiftKey && e.key === 'Enter') {
        setShowHiddenIcons(!showHiddenIcons);
      }
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('keydown', handleKeyDown as any);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('keydown', handleKeyDown as any);
    };
  }, [showHiddenIcons]);

  const handleIconClick = () => {
    if (clipboardContent) {
      //alert(clipboardContent);
      saveConfig(clipboardContent, isConnected, isLoading, appLang);
      setShowPasteOption(false);
    }
  };

  return (
    <nav className="header">
      <div className="container">
        <div
          onClick={(e) => { try { sessionStorage.setItem('ADV', (e as any).shiftKey ? '1' : '0'); } catch {} ; toggleDrawer(); }}
          className="navMenu"
          role="button"
          tabIndex={0}
          onKeyDown={handleMenuOnKeyDown}
        >
          <i className={classNames('material-icons', 'pull-right')}>&#xe5d2;</i>
          <div
            className={classNames('indicator', hasNewUpdate ? '' : 'hidden')}
          />
        </div>
        <Link hidden={!showHiddenIcons} to="/about" tabIndex={0}>
          <i className={classNames('material-icons', 'navLeft')}>&#xe88e;</i>
        </Link>
        <Link hidden={!showHiddenIcons} to={'/debug'} tabIndex={0}>
          <i className={classNames('material-icons', 'log')}>&#xe868;</i>
        </Link>
        {showPasteOption && (
          <div
            onClick={handleIconClick}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleIconClick();
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="Paste configuration"
          >
            <i className={classNames('material-icons', 'navPaste')}>&#xea8e;</i>
          </div>
        )}
      </div>
    </nav>
  );
};
export default LandingHeader;