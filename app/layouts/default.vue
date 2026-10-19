<template>
  <div class="site-layout">
    <SiteHeader />

    <div class="main-column">
      <PageTopbar />

      <main id="main" tabindex="-1">
        <slot />
      </main>

      <SiteFooter />
    </div>

    <ProfileSidebar />
  </div>
</template>
