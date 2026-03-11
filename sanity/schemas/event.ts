import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'gateTime',
      title: 'Gate Time',
      type: 'string',
    }),
    defineField({
      name: 'raceTime',
      title: 'Race Time',
      type: 'string',
    }),
    defineField({
      name: 'raceClasses',
      title: 'Race Classes',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'sponsorName',
              title: 'Sponsor Name',
              type: 'string',
            }),
            defineField({
              name: 'className',
              title: 'Class Name',
              type: 'string',
            }),
          ],
          preview: {
            select: {title: 'className', subtitle: 'sponsorName'},
          },
        },
      ],
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'ticketLink',
      title: 'Ticket Link',
      type: 'url',
    }),
    defineField({
      name: 'streamLink',
      title: 'Stream Link',
      type: 'url',
    }),
    defineField({
      name: 'admissionInfo',
      title: 'Admission Info',
      type: 'text',
    }),
    defineField({
      name: 'eventType',
      title: 'Event Type',
      type: 'string',
      options: {
        list: [
          {title: 'Weekly', value: 'weekly'},
          {title: 'Special', value: 'special'},
          {title: 'Practice', value: 'practice'},
          {title: 'External', value: 'external'},
        ],
      },
    }),
    defineField({
      name: 'isExternal',
      title: 'Is External',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'externalUrl',
      title: 'External URL',
      type: 'url',
      hidden: ({document}) => !document?.isExternal,
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured Event',
      type: 'boolean',
      description: 'Flag major events for hero treatment on the schedule page',
      initialValue: false,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Scheduled', value: 'scheduled'},
          {title: 'Postponed', value: 'postponed'},
          {title: 'Cancelled', value: 'cancelled'},
          {title: 'Completed', value: 'completed'},
          {title: 'Sold Out', value: 'soldOut'},
        ],
      },
      initialValue: 'scheduled',
    }),
    defineField({
      name: 'recapNote',
      title: 'Recap Note',
      type: 'string',
      description: 'One-line post-race note (e.g. "John Doe wins Modified feature")',
    }),
    defineField({
      name: 'weatherStatus',
      title: 'Weather Status (Deprecated)',
      type: 'string',
      description: 'Deprecated: use Status field instead. Kept for backward compatibility.',
      options: {
        list: [
          {title: 'Normal', value: 'normal'},
          {title: 'Delayed', value: 'delayed'},
          {title: 'Cancelled', value: 'cancelled'},
          {title: 'TBD', value: 'tbd'},
        ],
      },
      initialValue: 'normal',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{type: 'block'}],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      media: 'image',
    },
    prepare({title, date, media}) {
      return {
        title,
        subtitle: date ? new Date(date).toLocaleDateString() : 'No date',
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Event Date (Newest)',
      name: 'dateDesc',
      by: [{field: 'date', direction: 'desc'}],
    },
    {
      title: 'Event Date (Oldest)',
      name: 'dateAsc',
      by: [{field: 'date', direction: 'asc'}],
    },
  ],
})
