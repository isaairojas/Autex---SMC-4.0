/**
 * Figma: Radio (componente 4973:32818 Medium / 4973:32822 Small; seleccionados 4973:32826 / 4973:32830)
 * Última sincronización: 2026-10-02
 */
import mediumOn from '../../../assets/icons/radio-medium-on.svg';
import smallOn from '../../../assets/icons/radio-small-on.svg';

type RadioProps = { selected: boolean; size?: 'medium' | 'small' };

export function Radio({ selected, size = 'medium' }: RadioProps) {
  const px = size === 'medium' ? 24 : 16;
  if (selected) return <img src={size === 'medium' ? mediumOn : smallOn} alt="" width={px} height={px} style={{ flexShrink: 0 }} />;
  return (
    <span
      aria-hidden
      style={{
        width: px,
        height: px,
        flexShrink: 0,
        boxSizing: 'border-box',
        borderRadius: 16,
        border: '2px solid var(--color-neutral-500)',
        background: 'var(--color-nativo-blanco)',
      }}
    />
  );
}
