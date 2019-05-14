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
            <li
              v-for="(item, index) in basicInfo"
              :key="item.name"
              :title="item.title"
              class="general__info"
              @mouseover="onMouseOverInfo"
              @mouseleave="onMouseLeaveInfo"
            >
              <div class="general__info__icon">
                <span class="fa-icon"><v-icon :name="item.faIcon" scale="2"/></span>
              </div>
              <div
                class="description hidden"
                :class="[index < basicInfo.length / 2 ? 'right' : 'left']"
              >
                {{ item.value }}
              </div>
            </li>
            <li
              class="general__info viblo"
              title="Viblo blog"
              @mouseover="onMouseOverInfo"
              @mouseleave="onMouseLeaveInfo"
              @click="open('https://viblo.asia/u/tran.dai.son')"
            >
              <div class="general__info__icon">
                <img src="@/assets/img/viblo.png" alt="Viblo">
              </div>
              <div
                class="description hidden"
                :class="[index < basicInfo.length / 2 ? 'right' : 'left']"
              >
                @tran.dai.son
              </div>
            </li>
          </ul>
        </div>
      </section>
      <section class="main-content">
        <div class="left-side">
          <div class="row">
            <div class="sub-content">
              <h2>About me</h2>
              <p>A back-end developer</p>
              <p>Interested in VueJS</p>
            </div>
          </div>
          <div class="row">
            <div class="sub-content">
              <h2>Experiences</h2>
              <div v-for="item in experiences" :key="item.company" class="sub-content__block">
                <div class="sub-content__logo">
                  <a :href="item.website" target="_blank">
                    <img :src="item.logo" :alt="item.company">
                  </a>
                </div>
                <div class="sub-content__body experience">
                  <div class="primary-content">
                    <h3 class="name">
                      <a :href="item.website" target="_blank">{{ item.company }}</a>
                    </h3>
                    <span class="location">{{ item.location }}</span>
                  </div>
                  <div class="secondary-content">
                    <span class="time">{{ `${item.from} - ${item.to}` }}</span>
                    <p class="major">{{ item.position }}</p>
                    <p class="description">{{ item.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="sub-content">
              <h2>Education</h2>
              <div v-for="item in education" :key="item.name" class="sub-content__block">
                <div class="sub-content__logo">
                  <a :href="item.website" target="_blank">
                    <img :src="item.logo" :alt="item.name">
                  </a>
                </div>
                <div class="sub-content__body">
                  <div class="primary-content">
                    <h3 class="name">
                      <a :href="item.website" target="_blank">{{ item.name }}</a>
                    </h3>
                    <span class="time">{{ `${item.from} - ${item.to}` }}</span>
                  </div>
                  <div class="secondary-content">
                    <p class="major">{{ item.subject }}</p>
                    <p class="description">{{ item.details }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="sub-content">
              <h2>Skills</h2>
              <div class="sub-content__skills">
                <table class="sub-content__table">
                  <tr>
                    <th>
                      <div class="inner-text">Technical</div>
                    </th>
                  </tr>
                  <tr v-for="skill in skills" :key="skill.id">
                    <td>
                      <div class="inner-text" :title="skill.name">
                        <input
                          :class="['slider', skill.id]"
                          :title="skill.name"
                          type="range"
                          min="0"
                          max="10"
                          v-model="skill.value"
                        />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>
                      <div class="inner-text">General Skills</div>
                    </th>
                  </tr>
                  <tr v-for="skill in generalSkills" :key="skill">
                    <td>
                      <div class="inner-text">
                        {{ skill }}
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div class="right-side">
          <Timeline/>
        </div>
      </section>
      <section class="footer">
        <ul class="contact">
          <li class="contact__item">
            <a href="https://trandaison.github.io" target="_blank">
              <span class="fa-icon"><v-icon name="laptop-code"/></span> {{ website }}
            </a>
          </li>
          <li class="contact__item">
            <a href="https://github.com/trandaison" target="_blank">
              <span class="fa-icon"><v-icon name="brands/github"/></span> {{ github }}
            </a>
          </li>
          <li class="contact__item">
            <a href="https://www.facebook.com/sontran.ds" target="_blank">
              <span class="fa-icon"><v-icon name="brands/facebook"/></span> {{ facebook }}
            </a>
          </li>
          <li class="contact__item">
            <a :href="`mailto:${email}`">
              <span class="fa-icon"><v-icon name="envelope"/></span> {{ google }}
            </a>
          </li>
        </ul>
      </section>
    </div>

    <div class="download-link">
      <a class="button" href="#" @click.prevent.stop="downloadCV">
        <span class="fa-icon"><v-icon name="file-download"/></span>
        Download CV
      </a>
    </div>
  </div>
</template>

<script>
import dutLogo from '@/assets/img/dut_logo.png'
import atLogo from '@/assets/img/at_logo.png'
import framgiaLogo from '@/assets/img/framgia_logo.png'
import sunLogo from '@/assets/img/sun-logo.jpg'
import Timeline from './Timeline'

export default {
  name: 'Home',
  data () {
    const current = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      year: 'numeric'
    }).format(new Date())

    return {
      address: '135 Nguyen Duc Trung, Thanh Khe dist., Danang',
      phone: '+84 706 213188',
      email: 'sontd.it@gmail.com',
      github: 'trandaison',
      website: 'trandaison.github.io',
      facebook: 'sontran.ds',
      google: 'sontd.it',
      basicInfo: [
        {
          name: 'address',
          title: 'Address',
          value: '135 Nguyen Duc Trung, Thanh Khe dist., Danang',
          faIcon: 'map-marker-alt'
        }, {
          name: 'phone',
          title: 'Mobile',
          value: '+84 706 213188',
          faIcon: 'at'
        }, {
          name: 'email',
          title: 'Email',
          value: 'sontd.it@gmail.com',
          faIcon: 'mobile-alt'
        }
      ],
      experiences: [
        {
          company: 'Framgia Inc.',
          location: 'Danang',
          from: 'Dec 2016',
          to: 'March 2019',
          position: 'Ruby developer',
          description: null,
          website: 'https://sun-asterisk.vn/',
          logo: framgiaLogo
        }, {
          company: 'Sun*',
          location: 'Danang',
          from: 'March 2019',
          to: `${current}`,
          position: 'Ruby developer',
          description: null,
          website: 'https://sun-asterisk.vn/',
          logo: sunLogo
        }
      ],
      education: [
        {
          name: 'DUT',
          website: 'http://dut.udn.vn/KhoaCNTT',
          from: '2012',
          to: '2017',
          subject: 'IT Engineer',
          details: 'Class of 2012-2017',
          logo: dutLogo
        }, {
          name: 'Asian Tech',
          website: 'https://asiantech.vn/',
          from: 'June 2016',
          to: 'Aug 2016',
          subject: 'PHP Intern',
          details: '',
          logo: atLogo
        }, {
          name: 'Framgia Inc.',
          website: 'https://sun-asterisk.vn/',
          from: 'Oct 2016',
          to: 'Dec 2016',
          subject: 'Ruby Intern',
          details: '',
          logo: framgiaLogo
        }
      ],
      skills: [
        { name: 'HTML', value: 10, id: 'html' },
        { name: 'JS/jQuery', value: 10, id: 'js' },
        { name: 'ECMAScript 6', value: 10, id: 'es6' },
        { name: 'VueJS', value: 10, id: 'vuejs' },
        { name: 'CSS-SCSS', value: 9, id: 'css' },
        { name: 'MySQL', value: 9, id: 'mysql' },
        { name: 'Ruby', value: 8, id: 'ruby' },
        { name: 'NodeJS', value: 8, id: 'nodejs' },
        { name: 'PHP', value: 6, id: 'php' },
        { name: 'Java', value: 6, id: 'java' },
        { name: 'AngularJS', value: 5, id: 'angularjs' }
      ],
      generalSkills: [
        'Communication',
        'Problem Solving',
        'Leadership',
        'Teamwork',
        'Scrum',
        'Technical Seminar',
        'VueJS Basic Training'
      ]
    }
  },

  components: {
    Timeline
  },

  methods: {
    onMouseOverInfo (e) {
      const target = e.target
      const others = document.querySelectorAll('.general .general__info')
      for (let i = 0; i < others.length; i++) {
        const li = others[i]
        if (li !== target) {
          li.classList.add('invisible')
        }
      }

      target.classList.add('hovering')
    },

    onMouseLeaveInfo (e) {
      const target = e.target
      const others = document.querySelectorAll('.general .general__info')
      for (let i = 0; i < others.length; i++) {
        const li = others[i]
        if (li !== target) {
          li.classList.remove('invisible')
        }
      }

      target.classList.remove('hovering')
    },

    open (url) {
      window.open(url, '_blank')
    },

    downloadCV () {
      alert('Hãy liên hệ Sơn để nhận được CV.\nPlease contact Son to get the lastest CV.')
    }
  }
}
</script>
