import React, { ReactNode, CSSProperties } from 'react';
import { Typography } from 'antd';

const { Title, Paragraph } = Typography;

interface PageContainerProps {
    title: string;
    subtitle?: string;
    actions?: ReactNode;
    children: ReactNode;
}

const wrapperStyle: CSSProperties = {
    position: 'relative',
    padding: 32,
    borderRadius: 32,
    background: 'linear-gradient(135deg, #eef4ff 0%, #f9fbff 55%, #e5f6ff 100%)',
    boxShadow: '0 30px 80px rgba(15, 60, 140, 0.08)',
    overflow: 'hidden'
};

const glowBase: CSSProperties = {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: '50%',
    filter: 'blur(90px)',
    opacity: 0.7
};

const headingStyle: CSSProperties = {
    margin: 0,
    fontWeight: 700,
    background: 'linear-gradient(135deg, #0061ff 0%, #60efff 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    color: 'transparent'
};

const PageContainer: React.FC<PageContainerProps> = ({ title, subtitle, actions, children }) => (
    <div style={{ marginBottom: 32 }}>
        <div style={wrapperStyle}>
            <div style={{ ...glowBase, top: -120, right: -80, background: 'rgba(0, 97, 255, 0.2)' }} />
            <div style={{ ...glowBase, bottom: -140, left: -100, background: 'rgba(96, 239, 255, 0.25)' }} />
            <div style={{ position: 'relative', zIndex: 2 }}>
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 16,
                    marginBottom: 32
                }}>
                    <div style={{ maxWidth: 520 }}>
                        <Title level={2} style={headingStyle}>{title}</Title>
                        {subtitle && (
                            <Paragraph style={{ color: '#5c6c7f', marginBottom: 0, fontSize: 16 }}>
                                {subtitle}
                            </Paragraph>
                        )}
                    </div>
                    {actions && (
                        <div style={{ display: 'flex', gap: 12 }}>
                            {actions}
                        </div>
                    )}
                </div>
                {children}
            </div>
        </div>
    </div>
);

export default PageContainer;

