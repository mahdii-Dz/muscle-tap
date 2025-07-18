'use client'
import React, { useContext, useEffect } from 'react'
import { GlobalContext } from '../context/Context'
import useExercises from './useExercises'
import Loading from './Loading'
import Image from 'next/image'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import SortableList, { SortableItem, SortableKnob } from 'react-easy-sort'
import { arrayMoveImmutable } from 'array-move'
import dynamic from 'next/dynamic'

const Instructions = dynamic(()=>import('./Instructions'))



function SuggestedExercises({ customClassName }) {
    const { muscles, showInfo, setShowInfo, infoExercise, setInfoExercise, exercises, setExercises } = useContext(GlobalContext)
    const { data: InitialExercises, isLoading } = useExercises(muscles)


    useEffect(() => {
        setExercises(InitialExercises || [])
    }, [InitialExercises])

    if (isLoading) {
        return (
            <div className='w-full h-full flex flex-col gap-4 justify-center items-center'>
                <Loading />
                <div>Loading...</div>
            </div>
        )
    }


    function handleDelete(index) {
        setExercises((prev) => prev.filter((_, i) => i !== index))
    }

    const onSortEnd = (oldIndex, newIndex) => {
        setExercises((array) => arrayMoveImmutable(array, oldIndex, newIndex))
    }


    return (
        <section className={`w-full h-auto py-12 px-8 mb-16 ${customClassName}`}>
            <h1 className='text-xl font-semibold mb-8'>Customize Exercises</h1>
            <SortableList onSortEnd={onSortEnd} className="list" draggedItemClassName='dragged' lockAxis='y'>
                {
                    exercises
                        ? exercises.map((exo, index) => (
                            <SortableItem key={index} >
                                <div className='item w-full h-16 flex bg-gray-800 px-4 mb-2 select-none rounded-lg justify-between items-center'>
                                    <div className="dragIcon flex gap-2 items-center ">
                                        <SortableKnob>
                                            <div className='p-1 cursor-grab'>
                                                <Image src={'/grip-vertical.svg'} alt='grab icon' width={20} height={20} className='cursor-grab !min-w-5 !min-h-5 pointer-events-none' draggable={false} />
                                            </div>
                                        </SortableKnob>
                                        <span className='bg-primary-1 text-white text-sm font-semibold rounded-sm px-2 py-1'>{exo.muscle}</span>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <div onClick={() => {
                                                    setShowInfo(true)
                                                    setInfoExercise(exo)
                                                }}>
                                                    <Image src={'/info.svg'} alt='info icon' width={20} height={20} className='cursor-pointer !min-w-5 !min-h-5' />
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p >instructions</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                    <div>
                                        <span>{exo.name}</span>
                                    </div>
                                    <div>
                                        <button onClick={() => handleDelete(index)}>
                                            <Image src={'/trash.svg'} alt='delete icon' width={20} height={20} className='opacity-85 cursor-pointer !min-w-5 !min-h-5' />
                                        </button>
                                    </div>
                                </div>
                            </SortableItem>
                        ))
                        : <span>No Exercises found</span>
                }
            </SortableList>
            {
                showInfo && infoExercise && <Instructions exercise={infoExercise} />
            }
        </section>
    )
}

export default SuggestedExercises