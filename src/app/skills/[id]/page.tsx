'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

import { CircusLinkButton } from '@/components/ui';
import { trpc } from '@/utils/trpc';

export default function SkillDetailPage() {
  const params = useParams();

  const skillId = params.id as string;

  const { data: skills, isLoading, error } = trpc.circus.getSkills.useQuery();
  const { data: classPlansUsingSkill } =
    trpc.circus.getClassPlansUsingSkill.useQuery({
      skillId,
    });
  const skill = skills?.find(s => s.id === skillId);

  if (isLoading)
    return <div className='text-muted-foreground'>Loading skill...</div>;
  if (error)
    return (
      <div className='text-destructive'>
        Error loading skill: {error.message}
      </div>
    );
  if (!skill)
    return <div className='text-muted-foreground'>Skill not found</div>;

  // Parse applicable weeks
  const applicableWeeks: [] = (() => {
    try {
      return Array.isArray(skill.applicableWeeks)
        ? skill.applicableWeeks
        : JSON.parse(skill.applicableWeeks as string);
    } catch {
      return [];
    }
  })();

  // Get parent and children skills
  const parentSkill = skills?.find(s => s.id === skill.parentId);
  const childrenSkills = skills?.filter(s => s.parentId === skill.id) ?? [];

  // Get sibling skills (this is a simplified approach - in a real app you'd want to handle the many-to-many relationship properly)
  const siblingSkills =
    skills?.filter(
      s =>
        s.id !== skill.id &&
        s.parentId === skill.parentId &&
        skill.parentId !== null
    ) ?? [];

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='max-w-4xl mx-auto'>
        {/* Breadcrumb */}
        <nav className='flex mb-6' aria-label='Breadcrumb'>
          <ol className='inline-flex items-center space-x-1 md:space-x-3'>
            <li className='inline-flex items-center'>
              <Link
                href='/skills'
                className='text-foreground hover:text-primary'
              >
                Skills
              </Link>
            </li>
            <li>
              <div className='flex items-center'>
                <span className='mx-2 text-muted-foreground'>/</span>
                <span className='text-muted-foreground'>{skill.name}</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className='flex justify-between items-start mb-6'>
          <div>
            <h1 className='text-3xl font-bold'>{skill.name}</h1>
            <div className='flex items-center space-x-4 mt-2'>
              <span className='bg-secondary text-accent-foreground text-sm font-medium px-3 py-1 rounded'>
                {skill.apparatus.replace('_', ' ')}
              </span>
              <span className='bg-secondary text-accent-foreground text-sm font-medium px-3 py-1 rounded'>
                {skill.level.replace('_', ' ')}
              </span>
              {skill.core && (
                <span className='bg-accent text-accent-foreground text-sm font-medium px-3 py-1 rounded'>
                  Core Skill
                </span>
              )}
            </div>
          </div>
          <div className='flex space-x-2'>
            <CircusLinkButton link={`/skills/${skill.id}/edit`} text='Edit' />
          </div>
        </div>

        {/* Basic Information */}
        <div className='bg-card shadow-md rounded-lg p-6 mb-6'>
          <h2 className='text-xl font-semibold mb-4'>Basic Information</h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <span className='font-medium text-muted-foreground'>
                Apparatus:
              </span>
              <p className='text-lg text-card-foreground'>
                {skill.apparatus.replace('_', ' ')}
              </p>
            </div>
            <div>
              <span className='font-medium text-muted-foreground'>Level:</span>
              <p className='text-lg text-card-foreground'>
                {skill.level.replace('_', ' ')}
              </p>
            </div>
            <div>
              <span className='font-medium text-muted-foreground'>
                Core Skill:
              </span>
              <p className='text-lg text-card-foreground'>
                {skill.core ? 'Yes' : 'No'}
              </p>
            </div>
            <div>
              <span className='font-medium text-muted-foreground'>
                Taught In:
              </span>
              <p className='text-lg text-card-foreground'>
                {skill.taughtIn.replace(/,/g, ', ')}
              </p>
            </div>
          </div>
        </div>

        {/* Applicable Weeks */}
        <div className='bg-card shadow-md rounded-lg p-6 mb-6'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-xl font-semibold text-card-foreground'>
              Applicable Weeks
            </h2>
            {applicableWeeks.length > 0 && (
              <CircusLinkButton
                link={`/skills/${skill.id}/weeks`}
                text='Edit Weeks'
              />
            )}
          </div>

          {applicableWeeks.length > 0 ? (
            <div>
              <div className='flex flex-wrap gap-2 mb-4'>
                {applicableWeeks.map((week: number) => (
                  <span
                    key={week}
                    className='bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded'
                  >
                    Week {week}
                  </span>
                ))}
              </div>
              <p className='text-sm text-muted-foreground'>
                This skill is recommended for {applicableWeeks.length} weeks
                throughout the year.
              </p>
            </div>
          ) : (
            <div className='flex-1 text-center py-8'>
              <p className='text-muted-foreground mb-4'>
                No applicable weeks set for this skill.
              </p>
              <div className='max-w-xs content-around'>
                <CircusLinkButton
                  link={`/skills/${skill.id}/weeks`}
                  text='Set Applicable Weeks'
                />
              </div>
            </div>
          )}
        </div>

        {/* Notes and Cues */}
        <div className='bg-card shadow-md rounded-lg p-6 mb-6'>
          <h2 className='text-xl font-semibold mb-4'>Teaching Information</h2>

          {skill.notes && (
            <div className='mb-6'>
              <span className='font-medium text-muted-foreground'>Notes:</span>
              <p className='mt-2 text-card-foreground whitespace-pre-wrap'>
                {skill.notes}
              </p>
            </div>
          )}

          {skill.cues && (
            <div>
              <span className='font-medium text-muted-foreground'>
                Teaching Cues:
              </span>
              <p className='mt-2 text-card-foreground whitespace-pre-wrap'>
                {skill.cues}
              </p>
            </div>
          )}

          {!skill.notes && !skill.cues && (
            <p className='text-muted-foreground'>
              No teaching notes or cues available for this skill.
            </p>
          )}
        </div>

        {/* Skill Relationships */}
        <div className='bg-card shadow-md rounded-lg p-6 mb-6'>
          <h2 className='text-xl font-semibold mb-4'>Skill Relationships</h2>

          {/* Parent Skill */}
          {parentSkill && (
            <div className='mb-6'>
              <span className='font-medium text-muted-foreground'>
                Prerequisite Skill:
              </span>
              <div className='mt-2'>
                <Link
                  href={`/skills/${parentSkill.id}`}
                  className='inline-flex items-center bg-muted hover:bg-muted/80 text-card-foreground text-sm font-medium px-3 py-2 rounded transition-colors'
                >
                  {parentSkill.name}
                  <span className='ml-2 text-xs text-muted-foreground'>
                    ({parentSkill.apparatus.replace('_', ' ')} -{' '}
                    {parentSkill.level.replace('_', ' ')})
                  </span>
                </Link>
              </div>
            </div>
          )}

          {/* Children Skills */}
          {childrenSkills.length > 0 && (
            <div className='mb-6'>
              <span className='font-medium text-muted-foreground'>
                Next Skills to Learn:
              </span>
              <div className='mt-2 flex flex-wrap gap-2'>
                {childrenSkills.map(childSkill => (
                  <Link
                    key={childSkill.id}
                    href={`/skills/${childSkill.id}`}
                    className='inline-flex items-center bg-accent hover:bg-accent/80 text-accent-foreground text-sm font-medium px-3 py-2 rounded transition-colors'
                  >
                    {childSkill.name}
                    <span className='ml-2 text-xs text-muted-foreground'>
                      ({childSkill.apparatus.replace('_', ' ')} -{' '}
                      {childSkill.level.replace('_', ' ')})
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Sibling Skills */}
          {siblingSkills.length > 0 && (
            <div>
              <span className='font-medium text-muted-foreground'>
                Related Skills (Same Level):
              </span>
              <div className='mt-2 flex flex-wrap gap-2'>
                {siblingSkills.map(siblingSkill => (
                  <Link
                    key={siblingSkill.id}
                    href={`/skills/${siblingSkill.id}`}
                    className='inline-flex items-center bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium px-3 py-2 rounded transition-colors'
                  >
                    {siblingSkill.name}
                    <span className='ml-2 text-xs text-muted-foreground'>
                      ({siblingSkill.apparatus.replace('_', ' ')} -{' '}
                      {siblingSkill.level.replace('_', ' ')})
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {!parentSkill &&
            childrenSkills.length === 0 &&
            siblingSkills.length === 0 && (
              <p className='text-muted-foreground'>
                No skill relationships defined.
              </p>
            )}
        </div>

        {/* Usage in Class Plans */}
        <div className='bg-card shadow-md rounded-lg p-6'>
          <h2 className='text-xl font-semibold mb-4'>Class Plan Usage</h2>

          {classPlansUsingSkill && classPlansUsingSkill.length > 0 ? (
            <div>
              <p className='text-sm text-muted-foreground mb-4'>
                This skill is used in {classPlansUsingSkill.length} class
                plan(s):
              </p>
              <div className='space-y-3'>
                {classPlansUsingSkill.map(classPlan => (
                  <div
                    key={classPlan.id}
                    className='border border-border rounded-lg p-4'
                  >
                    <div className='flex justify-between items-start'>
                      <div>
                        <Link
                          href={`/class-plans/${classPlan.id}`}
                          className='text-lg font-medium text-primary hover:text-primary/80'
                        >
                          {classPlan.title}
                        </Link>
                        <p className='text-sm text-muted-foreground'>
                          {classPlan.class.name} -{' '}
                          {classPlan.class.instructor.user.name}
                        </p>
                        <p className='text-sm text-muted-foreground'>
                          {new Date(classPlan.date).toLocaleDateString()} (Week{' '}
                          {classPlan.weekOfYear})
                        </p>
                      </div>
                      <div className='text-right'>
                        <span className='bg-muted text-card-foreground text-xs font-medium px-2 py-1 rounded'>
                          {classPlan.duration} min
                        </span>
                      </div>
                    </div>
                    {classPlan.description && (
                      <p className='text-sm text-card-foreground mt-2'>
                        {classPlan.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className='text-center py-8'>
              <p className='text-muted-foreground mb-4'>
                This skill hasn&apos;t been used in any class plans yet.
              </p>
              <Link
                href={`/class-plans/create?skillId=${skill.id}`}
                className='bg-primary hover:bg-primary/80 text-primary-foreground font-bold py-2 px-4 rounded'
              >
                Create Class Plan with This Skill
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
