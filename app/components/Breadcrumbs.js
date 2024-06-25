import { BreadcrumbGroup } from "@cloudscape-design/components"

export const HomeBreadcrumbs = () => {
    return <BreadcrumbGroup
        items={[
            { text: "Use Cases and Resources", href: "/" },
            { text: "Explore and Search", href: "#" },
        ]}
        ariaLabel="Breadcrumbs"
    />
}
