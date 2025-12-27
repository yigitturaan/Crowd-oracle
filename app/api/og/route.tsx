import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const outcome = searchParams.get('outcome') || 'lose'; // 'win' or 'lose'
    const price = searchParams.get('price') || '0';
    
    const isWin = outcome === 'win';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isWin ? '#000' : '#1a0505',
            backgroundImage: isWin 
              ? 'radial-gradient(circle at center, #4d3800 0%, #000000 70%)' 
              : 'radial-gradient(circle at center, #450a0a 0%, #000000 70%)',
            fontFamily: 'sans-serif',
            color: 'white',
            position: 'relative',
          }}
        >
          {/* DEKORATİF ÇEMBERLER */}
          <div style={{
            position: 'absolute',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            border: isWin ? '4px solid rgba(250, 204, 21, 0.3)' : '4px solid rgba(220, 38, 38, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
             <div style={{
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                border: isWin ? '2px solid rgba(250, 204, 21, 0.5)' : '2px solid rgba(220, 38, 38, 0.5)',
             }} />
          </div>

          {/* BAŞLIK */}
          <div style={{
            fontSize: 80,
            fontWeight: 900,
            background: isWin ? 'linear-gradient(to bottom, #fde047, #eab308)' : 'linear-gradient(to bottom, #f87171, #dc2626)',
            backgroundClip: 'text',
            color: 'transparent',
            textTransform: 'uppercase',
            marginBottom: 20,
            zIndex: 10,
          }}>
            {isWin ? 'KEHANET DOĞRULANDI' : 'GERÇEKLİK SAPMASI'}
          </div>

          {/* FİYAT BİLGİSİ */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
            <div style={{ fontSize: 30, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '4px' }}>
              1 Ocak ETH Fiyatı
            </div>
            <div style={{ fontSize: 90, fontWeight: 'bold', color: 'white', marginTop: 10 }}>
              ${price}
            </div>
          </div>

          {/* LOGO / İMZA */}
          <div style={{ position: 'absolute', bottom: 40, fontSize: 24, color: isWin ? '#fde047' : '#f87171', letterSpacing: '2px', opacity: 0.8 }}>
            CROWD ORACLE
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: any) {
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
}