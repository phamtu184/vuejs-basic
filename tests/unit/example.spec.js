import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import TitleTab from '@/components/titleTab.vue'
import ChildTab from '@/components/childTab.vue'

describe('titleTab.vue', () => {
  it('renders props.title when passed', () => {
    const title = 'new title';
    const wrapper = shallowMount(TitleTab, {
      propsData: { title }
    })
    expect(wrapper.text()).to.include(title);
  })

  it('renders h4 tag is correct', () => {
    const title = 'this is a h4 title tag';
    const wrapper = shallowMount(TitleTab, {
      propsData: { title }
    });
    expect(wrapper.find('h4').text()).to.equal('this is a h4 title tag');
  })
})

describe('childTab.vue', () => {
  it('renders props.buttonTab, props.isActive when passed', () => {
    const buttonTab = 'new buttonTab';
    const isActive = true;
    const wrapper = shallowMount(ChildTab, {
      propsData: { buttonTab, isActive }
    })
    expect(wrapper.text()).to.include(buttonTab, isActive);
  })
})