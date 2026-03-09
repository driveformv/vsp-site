import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'raceClass',
  title: 'Race Class',
  type: 'document',
  fields: [
    defineField({
      name: 'className',
      title: 'Class Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sponsorName',
      title: 'Sponsor Name',
      type: 'string',
    }),
    defineField({
      name: 'division',
      title: 'Division',
      type: 'string',
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'rulesPdf',
      title: 'Rules PDF',
      type: 'file',
    }),
  ],
  preview: {
    select: {
      title: 'className',
      sponsor: 'sponsorName',
      active: 'active',
    },
    prepare({title, sponsor, active}) {
      return {
        title,
        subtitle: `${sponsor || 'No sponsor'}${active === false ? ' (Inactive)' : ''}`,
      }
    },
  },
})
