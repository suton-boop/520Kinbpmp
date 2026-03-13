<?php
$file = 'c:/Users/suton/.gemini/antigravity/brain/Dasboardkin520/resources/js/Layouts/AuthenticatedLayout.jsx';
$content = file_get_contents($file);

if (strpos($content, "route('users.index')") === false) {
    // Add to Desktop Menu
    $searchDesktop = <<<EOT
                                <NavLink
                                    href={route('anggaran')}
                                    active={route().current('anggaran')}
                                >
                                    Anggaran
                                </NavLink>
EOT;
    
    $replaceDesktop = $searchDesktop . <<<EOT

                                {user.roles && user.roles.includes('superadmin') && (
                                    <NavLink
                                        href={route('users.index')}
                                        active={route().current('users.*')}
                                    >
                                        Users
                                    </NavLink>
                                )}
EOT;
    $content = str_replace($searchDesktop, $replaceDesktop, $content);

    // Add to Mobile Menu
    $searchMobile = <<<EOT
                        <ResponsiveNavLink
                            href={route('anggaran')}
                            active={route().current('anggaran')}
                        >
                            Anggaran
                        </ResponsiveNavLink>
EOT;

    $replaceMobile = $searchMobile . <<<EOT

                        {user.roles && user.roles.includes('superadmin') && (
                            <ResponsiveNavLink
                                href={route('users.index')}
                                active={route().current('users.*')}
                            >
                                Users
                            </ResponsiveNavLink>
                        )}
EOT;
    $content = str_replace($searchMobile, $replaceMobile, $content);
    
    file_put_contents($file, $content);
}
echo "Done layout update\n";
