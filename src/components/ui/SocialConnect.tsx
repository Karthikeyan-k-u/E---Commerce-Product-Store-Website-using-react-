import React, { useId, useState, type FormEvent } from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { Modal } from './Modal';
import {
  buildWhatsAppUrl,
  DEFAULT_PHONE_PREFIX,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  isInstagramConfigured,
  isValidPhone,
} from '../../lib/social';
import { InstagramGlyph, WhatsAppGlyph } from './SocialGlyphs';
import { cn } from '../../lib/utils';

interface SocialConnectProps {
  variant?: 'buttons' | 'icons';
  className?: string;
}

export const SocialConnect: React.FC<SocialConnectProps> = ({ variant = 'buttons', className }) => {
  const phoneId = useId();
  const consentId = useId();
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [phone, setPhone] = useState(DEFAULT_PHONE_PREFIX);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isIcons = variant === 'icons';

  const openWhatsApp = () => {
    setError(null);
    setIsWhatsAppOpen(true);
  };

  const closeWhatsApp = () => {
    setIsWhatsAppOpen(false);
    setError(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValidPhone(phone)) {
      setError('Enter a valid mobile number with country code, for example +91 98765 43210.');
      return;
    }

    if (!consent) {
      setError('Please agree to receive updates on WhatsApp to continue.');
      return;
    }

    const url = buildWhatsAppUrl(phone);
    const opened = window.open(url, '_blank');
    if (opened) {
      opened.opener = null;
    } else {
      window.location.href = url;
    }
    closeWhatsApp();
  };

  const instagramButton = (
    <a
      href={isInstagramConfigured ? INSTAGRAM_URL : undefined}
      target="_blank"
      rel="noopener noreferrer"
      aria-disabled={!isInstagramConfigured}
      title={isInstagramConfigured ? `Follow @${INSTAGRAM_HANDLE} on Instagram` : 'Instagram link coming soon'}
      className={cn(
        isIcons
          ? 'w-8 h-8 rounded-lg bg-white dark:bg-surface border border-slate-200 dark:border-surface-border flex items-center justify-center text-slate-500 dark:text-text-muted hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/40 transition-colors shadow-xs'
          : 'inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-surface-border bg-surface px-4 text-sm font-medium text-text-primary transition-colors hover:border-indigo-500/40 hover:text-indigo-600 dark:hover:text-indigo-400',
        !isInstagramConfigured && 'pointer-events-none opacity-50'
      )}
    >
      <InstagramGlyph />
      {!isIcons && <span>@{INSTAGRAM_HANDLE}</span>}
      {isIcons && <span className="sr-only">Follow @{INSTAGRAM_HANDLE} on Instagram</span>}
    </a>
  );

  const whatsappButton = (
    <button
      type="button"
      onClick={openWhatsApp}
      title="Get Whole Mart updates on WhatsApp"
      className={cn(
        isIcons
          ? 'w-8 h-8 rounded-lg bg-white dark:bg-surface border border-slate-200 dark:border-surface-border flex items-center justify-center text-slate-500 dark:text-text-muted hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/40 transition-colors shadow-xs'
          : 'inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-surface-border bg-surface px-4 text-sm font-medium text-text-primary transition-colors hover:border-indigo-500/40 hover:text-indigo-600 dark:hover:text-indigo-400'
      )}
    >
      <WhatsAppGlyph />
      {!isIcons && <span>Get WhatsApp Updates</span>}
      {isIcons && <span className="sr-only">Get Whole Mart updates on WhatsApp</span>}
    </button>
  );

  return (
    <>
      <div
        className={cn(
          isIcons ? 'flex items-center space-x-3' : 'flex flex-col gap-3 sm:flex-row sm:justify-center',
          className
        )}
      >
        {instagramButton}
        {whatsappButton}
      </div>

      <Modal
        isOpen={isWhatsAppOpen}
        onClose={closeWhatsApp}
        title="Get Whole Mart updates"
        description="Share your mobile number and we will open a WhatsApp chat. You send the message yourself."
        maxWidth="sm"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id={phoneId}
            label="Mobile number"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            onChange={(event) => {
              setPhone(event.target.value);
              setError(null);
            }}
            leftIcon={<Phone className="h-4 w-4" />}
            placeholder="+91 98765 43210"
            helperText="Include your country code so we can reach you on WhatsApp."
            required
          />

          <div className="flex items-start gap-3">
            <input
              id={consentId}
              type="checkbox"
              checked={consent}
              onChange={(event) => {
                setConsent(event.target.checked);
                setError(null);
              }}
              className="mt-0.5 h-4 w-4 rounded border-surface-border text-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
            />
            <label htmlFor={consentId} className="text-xs leading-5 text-text-secondary">
              I agree to receive Whole Mart product and offer updates on WhatsApp.
            </label>
          </div>

          {error && (
            <p className="text-xs text-rose-500" role="alert">
              {error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="ghost" onClick={closeWhatsApp}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              leftIcon={<MessageCircle className="h-4 w-4" />}
            >
              Continue on WhatsApp
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};
