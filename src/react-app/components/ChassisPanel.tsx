import React from 'react';

interface ChassisPanelProps {
  title: string;
  headerAction?: React.ReactNode;
  footerNote?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * ⚛️ REACT PATTERN: Content Projection via `children` + JSX props (`headerAction`, `footerNote`).
 * Contrast this with Vue's `<slot />` and `<slot name="headerAction" />`.
 */
export const ChassisPanel: React.FC<ChassisPanelProps> = ({
  title,
  headerAction,
  footerNote,
  children,
}) => {
  return (
    <section className="chassis-panel">
      <header className="chassis-panel-header">
        <div className="chassis-panel-title-wrap">
          <span className="rivet-dot" />
          <h2 className="chassis-panel-title">{title}</h2>
        </div>
        {headerAction && <div>{headerAction}</div>}
      </header>
      <div className="chassis-panel-body">{children}</div>
      {footerNote && <footer className="chassis-panel-footer">{footerNote}</footer>}
    </section>
  );
};
