<template>
  <div class="container">
    <div class="content">
      <section class="heading">
        <div class="avatar">
          <img class="avatar__image" src="@/assets/img/avatar.jpg" alt="Avatar">
        </div>
        <div class="general">
          <h1 class="general__full-name">Trần Đại Sơn</h1>
          <ul class="general__basic-info">
            <li class="general__info">
              <div class="general__info__icon">
                <span class="fa-icon"><v-icon name="map-marker-alt" scale="2"/></span>
              </div>
              <div class="description right hidden">{{ address }}</div>
            </li>
            <li class="general__info">
              <div class="general__info__icon">
                <span class="fa-icon"><v-icon name="at" scale="2"/></span>
              </div>
              <div class="description right hidden"><a :href="`mailto:${email}`" v-text="email"/></div>
            </li>
            <li class="general__info">
              <div class="general__info__icon">
                <span class="fa-icon"><v-icon name="mobile-alt" scale="2"/></span>
              </div>
              <div class="description left hidden">{{ phone }}</div>
            </li>
            <li class="general__info">
              <div class="general__info__icon">
                <span class="fa-icon"><v-icon name="calendar-alt" scale="2"/></span>
              </div>
              <div class="description left hidden">12/03/1994</div>
            </li>
          </ul>
        </div>
      </section>
      <section class="main-content">
        <div class="left-side">

        </div>
        <div class="right-side">

        </div>
      </section>
      <section class="footer">
        <ul class="contact">
          <li class="contact__item">
            <a href="https://trandaison.github.io">
              <span class="fa-icon"><v-icon name="laptop-code"/></span> {{ website }}
            </a>
          </li>
          <li class="contact__item">
            <a href="https://github.com/trandaison">
              <span class="fa-icon"><v-icon name="brands/github"/></span> {{ github }}
            </a>
          </li>
          <li class="contact__item">
            <a href="https://www.facebook.com/sontran.ds">
              <span class="fa-icon"><v-icon name="brands/facebook"/></span> {{ facebook }}
            </a>
          </li>
          <li class="contact__item">
            <a :href="`mailto:${email}`">
              <span class="fa-icon"><v-icon name="brands/google-plus-square"/></span> {{ google }}
            </a>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      address: '135 Nguyen Duc Trung, Thanh Khe dist., Danang',
      phone: '+84 706 213188',
      email: 'sontd.it@gmail.com',
      github: 'trandaison',
      website: 'trandaison.github.io',
      facebook: 'sontran.ds',
      google: 'sontd.it'
    }
  }
}
</script>
