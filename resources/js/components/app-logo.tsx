import AppLogoIcon from './app-logo-icon';

type roleProps = {
    role: number;
};

export default function AppLogo({ role }: roleProps) {
    const roleWords: { [key: number]: string } = {
        1: 'Super Admin Panel',
        2: 'Staff',
        3: 'User',
        5: 'UBAAP Panel',
        4: 'Resort Panel',
        6: 'Hotel Management',
        7: 'Restaurant Panel',
    };

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <AppLogoIcon className="size-5 fill-current" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">{roleWords[role]}</span>
            </div>
        </>
    );
}
